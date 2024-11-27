import { useActiveUser } from 'nostr-hooks';

import { useActiveGroup, useGlobalProfile, useLoginModalState } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useActiveUserInfo = () => {
  const { activeUser } = useActiveUser();

  const { activeGroupId } = useActiveGroup();
  const { profile } = useGlobalProfile({ pubkey: activeUser?.pubkey });
  const { openLoginModal } = useLoginModalState();

  const isCollapsed = useStore((state) => state.isCollapsed);

  return {
    activeUser,
    activeGroupId,
    profile,
    openLoginModal,
    isCollapsed,
  };
};
