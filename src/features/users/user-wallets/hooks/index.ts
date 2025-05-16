import { useActiveUser } from 'nostr-hooks';
import { useParams } from 'react-router-dom';

import { useLoginModalState } from '@/shared/hooks';

export const useUserWallets = () => {
  const { activeUser } = useActiveUser();
  const { openLoginModal } = useLoginModalState();

  const { code } = useParams<{ code: string }>();
  const isWalletDetailVisible = !!code;

  return {
    isWalletDetailVisible,
    activeUser,
    openLoginModal,
  };
};