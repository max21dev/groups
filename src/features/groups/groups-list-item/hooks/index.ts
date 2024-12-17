import { useActiveUser } from 'nostr-hooks';
import {
  useGroupAdmins,
  useGroupChats,
  useGroupMembers,
  useGroupMetadata,
} from 'nostr-hooks/nip29';
import { useEffect, useState } from 'react';

import { useActiveGroup, useActiveRelay } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useGroupsListItem = ({
  groupId,
  setLastChatTimestampPerGroup,
}: {
  groupId: string;
  setLastChatTimestampPerGroup: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) => {
  const [showGroup, setShowGroup] = useState<boolean>(true);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const isCollapsed = useStore((state) => state.isCollapsed);

  const groupsFilter = useStore((state) => state.groupsFilter);

  const { activeUser } = useActiveUser();

  const { activeRelay } = useActiveRelay();

  const { setActiveGroupId, activeGroupId } = useActiveGroup();

  const { metadata } = useGroupMetadata(activeRelay, groupId);
  const { admins } = useGroupAdmins(activeRelay, groupId);
  const { members } = useGroupMembers(activeRelay, groupId);
  const { chats } = useGroupChats(activeRelay, groupId, { limit: 1 });

  useEffect(() => {
    if (!activeUser || !activeUser.pubkey) return;
    if (!members || !members.length) return;

    const isMember = members.some((member) => member.pubkey === activeUser.pubkey);

    setIsMember(isMember);
  }, [members, activeUser, setIsMember]);

  useEffect(() => {
    if (!activeUser || !activeUser.pubkey) return;
    if (!admins || !admins.length) return;

    const isAdmin = admins.some((admin) => admin.pubkey === activeUser.pubkey);

    setIsAdmin(isAdmin);
  }, [admins, activeUser, setIsAdmin]);

  useEffect(() => {
    if (!activeUser || !activeUser.pubkey) return;

    const hasFilter = groupsFilter && Object.values(groupsFilter).some((value) => !value);

    if (hasFilter) {
      setShowGroup(false);

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
  }, [isMember, isAdmin, activeUser, groupsFilter, setShowGroup]);

  useEffect(() => {
    if (!groupId) return;

    setLastChatTimestampPerGroup((prev) => ({
      ...prev,
      [groupId]: chats && chats.length ? chats[chats.length - 1].timestamp : 0,
    }));
  }, [groupId, chats, setLastChatTimestampPerGroup]);

  return {
    setActiveGroupId,
    metadata,
    chats,
    isCollapsed,
    activeRelay,
    activeGroupId,
    showGroup,
  };
};
