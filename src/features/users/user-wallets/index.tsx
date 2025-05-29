import { LoginButton } from '@/features/chats/chat-bottom-bar/components';

import { WalletDetail, WalletList } from './components';
import { useUserWallets } from './hooks';

export const UserWallets = () => {
  const { activeUser, openLoginModal, isWalletDetailVisible } = useUserWallets();

  if (!activeUser) {
    return (
      <div className="mx-auto my-auto">
        <LoginButton
          openLoginModal={openLoginModal}
          text="To connect your wallet, please log in first."
        />
      </div>
    );
  }
  return (
    <div className="w-full max-w-2xl p-4 mx-auto [overflow-wrap:anywhere]">
      {isWalletDetailVisible ? <WalletDetail /> : <WalletList />}
    </div>
  );
};
