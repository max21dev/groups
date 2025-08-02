import { useActiveUser } from 'nostr-hooks';
import { useMatch, useParams } from 'react-router-dom';

import { useLoginModalState } from '@/shared/hooks';

export const useUserWallets = () => {
  const { activeUser } = useActiveUser();
  const { openLoginModal } = useLoginModalState();

  const { code } = useParams<{ code: string }>();
  const isWalletDetailVisible = !!code;
  const isCashuWalletDetailVisible = !!useMatch('/wallets/cashu');

  return {
    isWalletDetailVisible,
    isCashuWalletDetailVisible,
    activeUser,
    openLoginModal,
  };
};
