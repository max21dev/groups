import { useActiveUser } from 'nostr-hooks';

import { useActiveGroup, useGlobalProfile, useLoginModalState, useGlobalNdk } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useActiveUserInfo = () => {
  const { globalNdk } = useGlobalNdk();

  const { activeUser } = useActiveUser({ customNdk: globalNdk });

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
