import { useActiveUser } from 'nostr-hooks';

import { useActiveGroup, useLoginParam, useProfile } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useActiveUserInfo = () => {
  const { activeUser } = useActiveUser();

  const { activeGroupId } = useActiveGroup();
  const { profile } = useProfile({ pubkey: activeUser?.pubkey });
  const { openLoginModal } = useLoginParam();

  const isCollapsed = useStore((state) => state.isCollapsed);

  return {
    activeUser,
    activeGroupId,
    profile,
    openLoginModal,
    isCollapsed,
  };
};
