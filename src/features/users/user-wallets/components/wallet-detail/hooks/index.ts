import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { NWCClient } from '@/features/users/user-wallets/lib';
import { useWalletStore } from '@/features/users/user-wallets/store';
import { Transaction, WalletInfo } from '@/features/users/user-wallets/types';

import { useCopyToClipboard } from '@/shared/hooks';

export const useWalletDetail = () => {
  const getWalletInstance = useWalletStore((state) => state.getWalletInstance);
  const walletCodes = useWalletStore((state) => state.walletCodes);

  const [wallet, setWallet] = useState<NWCClient | null>(null);
  const [info, setInfo] = useState<WalletInfo | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { code } = useParams<{ code: string }>();
  const decodedCode = code ? decodeURIComponent(code) : '';

  const navigate = useNavigate();

  const { copyToClipboard, hasCopied } = useCopyToClipboard();

  useEffect(() => {
    if (!decodedCode) return;
    if (!walletCodes.includes(decodedCode)) {
      setError('Wallet not found');
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadWalletData = async () => {
      try {
        const client = await getWalletInstance(decodedCode);

        if (!mounted) return;

        if (!client) {
          setError('Failed to create wallet');
          setLoading(false);
          return;
        }

        setWallet(client);

        try {
          const infoResult = await client.getInfo();
          if (mounted) setInfo(infoResult);

          const balanceResult = await client.getBalance();
          if (mounted) setBalance(balanceResult?.balance);

          const txResult = await client.listTransactions({ limit: 20 });
          if (mounted && txResult?.transactions) {
            setTxs(txResult.transactions);
          }
        } catch (err) {
          if (mounted) {
            console.error('Data fetch error:', err);
            setError('Data fetch error');
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('Wallet initialization error:', err);
          setError('Initialization error');
          setLoading(false);
        }
      }
    };

    loadWalletData();

    return () => {
      mounted = false;
    };
  }, [decodedCode, walletCodes, getWalletInstance]);

  const formatSats = (msats: number | null) => {
    if (msats === null) return '-';
    const sats = msats / 1000;
    const btc = sats / 100000000;
    return `${sats} sats (${btc.toFixed(8)} BTC)`;
  };

  return {
    wallet,
    info,
    balance,
    txs,
    loading,
    error,
    formatSats,
    copyToClipboard,
    hasCopied,
    navigate,
    decodedCode,
  };
};
