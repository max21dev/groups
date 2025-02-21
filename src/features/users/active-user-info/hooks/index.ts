import { useActiveUser, useLogin, useProfile } from 'nostr-hooks';

import { useUserSettings } from '@/features/users/user-settings/hooks';

import { useSidebar } from '@/shared/components/sidebar/hooks';
import { useActiveGroup, useLoginModalState } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useActiveUserInfo = () => {
  const { activeUser } = useActiveUser();
  useUserSettings();
  const { activeGroupId } = useActiveGroup();
  const { logout } = useLogin();
  const { profile } = useProfile({ pubkey: activeUser?.pubkey });
  const { openLoginModal } = useLoginModalState();
  const isCollapsed = useStore((state) => state.isCollapsed);
  const { isMobile } = useSidebar();

  return {
    activeUser,
    activeGroupId,
    profile,
    openLoginModal,
    isCollapsed,
    isMobile,
    logout,
  };
};
