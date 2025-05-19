import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NWCClient } from '@/features/users/user-wallets/lib';
import { useWalletStore } from '@/features/users/user-wallets/store';
import { WalletInfo } from '@/features/users/user-wallets/types';

export const useWalletListItem = (code: string) => {
  const { removeWallet } = useWalletStore();
  const getWalletInstance = useWalletStore((state) => state.getWalletInstance);

  const [wallet, setWallet] = useState<NWCClient | null>(null);
  const [info, setInfo] = useState<WalletInfo | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initWallet = async () => {
      try {
        const client = await getWalletInstance(code);

        if (!mounted) return;

        if (!client) {
          setError('Failed to create wallet');
          setIsLoading(false);
          return;
        }

        setWallet(client);

        try {
          const infoResult = await client.getInfo();
          if (mounted) setInfo(infoResult);

          const balanceResult = await client.getBalance();
          if (!mounted) return;

          setBalance(balanceResult?.balance);
          setIsLoading(false);
        } catch (err) {
          if (!mounted) return;
          setError('Balance fetch error');
          setIsLoading(false);
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Wallet initialization error:', err);
        setError('Initialization error');
        setIsLoading(false);
      }
    };

    initWallet();

    return () => {
      mounted = false;
    };
  }, [code, getWalletInstance]);

  let pubkey: string = 'Invalid';
  let relays: string[] = [];
  let lud16: string | null = null;
  try {
    const url = new URL(code);
    pubkey = url.hostname;
    relays = url.searchParams.getAll('relay');
    lud16 = url.searchParams.get('lud16');
  } catch {}

  return {
    wallet,
    info,
    balance,
    isLoading,
    error,
    pubkey,
    relays,
    lud16,
    removeWallet,
    navigate,
  };
};
