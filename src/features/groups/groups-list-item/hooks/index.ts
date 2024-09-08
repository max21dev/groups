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

export const useGroupsListItem = ({ groupId }: { groupId: string | undefined }) => {
  const [showGroup, setShowGroup] = useState<boolean>(true);

  const { globalNdk } = useGlobalNdk();

  const { setActiveGroupId, activeGroupId } = useActiveGroup();
  const { activeUser } = useActiveUser({ customNdk: globalNdk });
  const { group } = useGroup(groupId);
  const { members } = useGroupMembers(group?.id);
  const { admins } = useGroupAdmins(group?.id);
  const groupsFilter = useStore((state) => state.groupsFilter);

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

  const messages = useGroupMessages(groupId, limitFilter);

  const isCollapsed = useStore((state) => state.isCollapsed);

  return {
    setActiveGroupId,
    group,
    messages,
    isCollapsed,
    activeGroupId,
    showGroup,
  };
};
