import { useActiveUser } from 'nostr-hooks';
import {
  useGroupAdmins,
  useGroupChats,
  useGroupMembers,
  useGroupMetadata,
} from 'nostr-hooks/nip29';
import { useEffect, useMemo } from 'react';

import { useGroupBookmark } from '@/features/groups/group-bookmark/hooks';
import { useGroupNotification } from '@/features/groups/group-notification/hooks';
import { useUserSettings } from '@/features/users/user-settings/hooks';

import { useSidebar } from '@/shared/components/sidebar/hooks';
import { useActiveGroup, useActiveRelay } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useGroupsListItem = ({
  groupId,
  setLastChatTimestampPerGroup,
}: {
  groupId: string;
  setLastChatTimestampPerGroup: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) => {
  const isCollapsed = useStore((state) => state.isCollapsed);
  const { isMobile } = useSidebar();

  const groupsFilter = useStore((state) => state.groupsFilter);

  const { activeUser } = useActiveUser();

  const { activeRelay } = useActiveRelay();

  const { setActiveGroupId, activeGroupId } = useActiveGroup();

  const { isBookmarked } = useGroupBookmark(groupId);

  const { metadata } = useGroupMetadata(activeRelay, groupId);
  const { admins } = useGroupAdmins(activeRelay, groupId);
  const { members } = useGroupMembers(activeRelay, groupId);
  const { chats } = useGroupChats(activeRelay, groupId, { limit: 1 });

  const { userSettings, updateLastSeenGroup } = useUserSettings();
  const { isNotificationEnabled } = useGroupNotification(groupId);

  const isMember = useMemo(
    () => members?.some((member) => member.pubkey === activeUser?.pubkey) ?? false,
    [members, activeUser],
  );

  const isAdmin = useMemo(
    () => admins?.some((admin) => admin.pubkey === activeUser?.pubkey) ?? false,
    [admins, activeUser],
  );

  const showGroup = useMemo(() => {
    if (!groupsFilter) return true;
    if (!Object.values(groupsFilter).some((value) => !value)) return true;

    return (
      (groupsFilter.belongTo && isMember) ||
      (groupsFilter.manage && isAdmin) ||
      (groupsFilter.notJoined && !isMember && !isAdmin) ||
      (groupsFilter.bookmarked && isBookmarked)
    );
  }, [isMember, isAdmin, groupsFilter, isBookmarked]);

  const hasNewMessage = useMemo(() => {
    if (!groupId || !activeRelay) return false;
    if (!isNotificationEnabled || !chats?.[0]?.timestamp) return false;

    const lastSeenTimestamp = userSettings.last_seen_groups.get(activeRelay)?.get(groupId) || 0;

    return chats[0].timestamp > lastSeenTimestamp && chats[0].timestamp > userSettings.created_at;
  }, [
    isNotificationEnabled,
    chats,
    userSettings.last_seen_groups,
    userSettings.created_at,
    activeRelay,
    groupId,
  ]);

  useEffect(() => {
    if (!groupId) return;

    setLastChatTimestampPerGroup((prev) => ({
      ...prev,
      [groupId]: chats?.[0]?.timestamp || 0,
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
    isMobile,
    updateLastSeenGroup,
    hasNewMessage,
  };
};
