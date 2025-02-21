import { useActiveUser } from 'nostr-hooks';
import { useGroupAdmins, useGroupMembers } from 'nostr-hooks/nip29';
import { useMemo } from 'react';

import { useUserSettings } from '@/features/users/user-settings/hooks';

import { useActiveRelay } from '@/shared/hooks';

export const useGroupNotification = (groupId: string | undefined) => {
  const { userSettings, updateUserSettings } = useUserSettings();
  const { activeRelay } = useActiveRelay();
  const { members } = useGroupMembers(activeRelay, groupId);
  const { admins } = useGroupAdmins(activeRelay, groupId);
  const { activeUser } = useActiveUser();

  const isMember = useMemo(
    () => members?.some((member) => member.pubkey === activeUser?.pubkey) ?? false,
    [members, activeUser],
  );

  const isAdmin = useMemo(
    () => admins?.some((admin) => admin.pubkey === activeUser?.pubkey) ?? false,
    [admins, activeUser],
  );

  const isNotificationEnabled = useMemo(() => {
    if (!groupId || !activeRelay) return false;

    if (
      userSettings.notif_exceptions &&
      userSettings.notif_exceptions.has(activeRelay) &&
      userSettings.notif_exceptions.get(activeRelay)?.has(groupId)
    ) {
      return userSettings.notif_exceptions.get(activeRelay)?.get(groupId) as boolean;
    }

    if (isAdmin) return userSettings.admin_groups;
    if (isMember) return userSettings.member_groups;

    return userSettings.not_joined_groups;
  }, [groupId, activeRelay, userSettings, isAdmin, isMember]);

  const toggleNotification = () => {
    if (!groupId || !activeRelay) return;

    const updatedExceptions = new Map(userSettings.notif_exceptions);
    if (!updatedExceptions.has(activeRelay)) {
      updatedExceptions.set(activeRelay, new Map());
    }

    updatedExceptions.get(activeRelay)?.set(groupId, !isNotificationEnabled);

    updateUserSettings({
      notif_exceptions: updatedExceptions,
    });
  };

  return {
    isNotificationEnabled,
    toggleNotification,
    activeUser,
  };
};
