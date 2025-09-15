import { useActiveUser, useLogin, useProfile } from 'nostr-hooks';
import { useNavigate } from 'react-router-dom';

import { useWalletStore } from '@/features/users/user-wallets/store';

import { useSidebar } from '@/shared/components/sidebar/hooks';
import { useActiveGroup, useLoginModalState } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useActiveUserInfo = () => {
  const { activeUser } = useActiveUser();
  const { activeGroupId } = useActiveGroup();
  const { logout: originalLogout } = useLogin();
  const { profile } = useProfile({ pubkey: activeUser?.pubkey });
  const { openLoginModal } = useLoginModalState();
  const isCollapsed = useStore((state) => state.isCollapsed);
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const clearWallets = useWalletStore((state) => state.clearWallets);

  const logout = () => {
    clearWallets();
    originalLogout();
  };

  return {
    activeUser,
    activeGroupId,
    profile,
    openLoginModal,
    isCollapsed,
    isMobile,
    logout,
    navigate,
  };
};
