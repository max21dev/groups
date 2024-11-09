import { useActiveUser } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import {
  useActiveGroup,
  useGlobalNdk,
  useGroup,
  useGroupAdmins,
  useGroupMembers,
  useGroupMessages,
} from '@/shared/hooks';
import { useStore } from '@/shared/store';
import { LimitFilter } from '@/shared/types';

const limitFilter: LimitFilter = { limit: 100 };

export const useGroupsListItem = ({
  groupId,
  setLastMessageTimestamp,
}: {
  groupId: string | undefined;
  setLastMessageTimestamp: React.Dispatch<React.SetStateAction<Map<string, number>>>;
}) => {
  const [showGroup, setShowGroup] = useState<boolean>(true);

  const isCollapsed = useStore((state) => state.isCollapsed);

  const groupsFilter = useStore((state) => state.groupsFilter);

  const { setActiveGroupId, activeGroupId } = useActiveGroup();
  const { globalNdk } = useGlobalNdk();
  const { group } = useGroup(groupId);
  const { admins } = useGroupAdmins(groupId);
  const { members } = useGroupMembers(groupId);

  const { activeUser } = useActiveUser({ customNdk: globalNdk });

  useEffect(() => {
    const hasFilter = groupsFilter && Object.values(groupsFilter).some((value) => !value);
    if (hasFilter && activeUser?.pubkey) {
      setShowGroup(false);
      const isMember =
        members.length > 0 && members.some((member) => member.publicKey === activeUser?.pubkey);
      const isAdmin =
        admins.length > 0 && admins.some((admin) => admin.publicKey === activeUser?.pubkey);
      if (groupsFilter.belongTo && isMember) {
        setShowGroup(true);
      }

      if (groupsFilter.manage && isAdmin) {
        setShowGroup(true);
      }

      if (groupsFilter?.notJoined && !isMember && !isAdmin) {
        setShowGroup(true);
      }
    } else {
      setShowGroup(true);
    }
  }, [members, admins, activeUser, groupsFilter]);

  const { messages } = useGroupMessages(groupId, limitFilter);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessageTimestamp((prev) => {
        if (!groupId) return prev;

        const newMap = new Map(prev);
        newMap.set(groupId, messages[0].createdAt);

        return newMap;
      });
    }
  }, [messages, setLastMessageTimestamp, groupId]);

  return {
    setActiveGroupId,
    group,
    messages,
    isCollapsed,
    activeGroupId,
    showGroup,
  };
};
