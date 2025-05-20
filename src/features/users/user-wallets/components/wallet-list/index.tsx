import { ArrowLeft } from 'lucide-react';

import { WalletListItem } from '@/features/users/user-wallets/components';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

import { useWalletList } from './hooks';

export const WalletList = () => {
  const { input, setInput, handleConnect, walletCodes, navigate } = useWalletList();

  return (
    <>
      <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
        <ArrowLeft className="sm:hidden hover:cursor-pointer" onClick={() => navigate('/')} />
        My Wallets
      </h3>
      <div className="rounded-lg border p-4 mb-6">
        <h4 className="text-lg mb-2">Add a New Wallet</h4>
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            type="text"
            placeholder="nostr+walletconnect://..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button disabled={!input.startsWith('nostr+walletconnect://')} onClick={handleConnect}>
            Connect Wallet
          </Button>
        </div>
        <p className="text-sm text-primary/60 mt-2">
          Paste a Nostr Wallet Connect (NWC) URI from your lightning wallet
        </p>
      </div>

      <div className="rounded-lg border">
        <h4 className="text-lg p-4 border-b">Connected Wallets</h4>
        {walletCodes.length === 0 ? (
          <div className="p-4 text-primary/60 text-center">No wallets connected yet.</div>
        ) : (
          <div className="w-full grid sm:grid-cols-1 lg:grid-cols-2 gap-2 p-4">
            {walletCodes.map((code: string) => (
              <WalletListItem key={code} code={code} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
