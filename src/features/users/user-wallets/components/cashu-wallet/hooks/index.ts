import { NDKKind, NDKRelaySet, NDKSubscriptionCacheUsage } from '@nostr-dev-kit/ndk';
import { NDKCashuWallet } from '@nostr-dev-kit/ndk-wallet';
import { useActiveUser, useLogin, useNdk } from 'nostr-hooks';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { discoveryRelays } from '@/features/users/user-wallets/configs';
import { useWalletStore } from '@/features/users/user-wallets/store';

import { useActiveRelay } from '@/shared/hooks';

export const useCashuWallet = () => {
  const {
    cashuWallet,
    cashuMintList,
    cashuLoading,
    cashuError,
    setCashuWallet,
    setCashuMintList,
    setCashuLoading,
    setCashuError,
    clearCashuWallet,
  } = useWalletStore();

  const { ndk } = useNdk();
  const { activeUser } = useActiveUser();
  const { loginData } = useLogin();
  const { activeRelay } = useActiveRelay();
  const navigate = useNavigate();

  const [refreshing, setRefreshing] = useState(false);

  const fetchMintList = useCallback(async () => {
    if (!activeUser?.pubkey || !ndk) return null;

    try {
      const relaySet = NDKRelaySet.fromRelayUrls(discoveryRelays, ndk);

      const mintListEvents = await ndk.fetchEvents(
        {
          kinds: [NDKKind.CashuMintList],
          authors: [activeUser.pubkey],
        },
        {
          closeOnEose: true,
          cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
        },
        relaySet,
      );

      const events = Array.from(mintListEvents).sort(
        (a, b) => (b.created_at || 0) - (a.created_at || 0),
      );

      if (events.length > 0) {
        const event = events[0];
        const mints = event.tags.filter((t) => t[0] === 'mint').map((t) => t[1]);
        const relays = event.tags.filter((t) => t[0] === 'relay').map((t) => t[1]);
        const pubkey = event.tags.find((t) => t[0] === 'pubkey')?.[1];

        const mintListData = { mints, relays, pubkey };
        setCashuMintList(mintListData);
        return mintListData;
      }

      return null;
    } catch (err) {
      console.error('Error fetching mint list:', err);
      return null;
    }
  }, [activeUser?.pubkey, ndk, setCashuMintList]);

  const fetchWallet = useCallback(async () => {
    if (!activeUser?.pubkey || !ndk) {
      return;
    }

    setCashuLoading(true);
    setCashuError(null);

    try {
      const mintListData = await fetchMintList();

      let walletRelays = discoveryRelays;
      if (mintListData?.relays?.length) {
        walletRelays = [...mintListData.relays];
      } else if (activeRelay) {
        walletRelays = [...discoveryRelays, activeRelay];
      }

      const relaySet = NDKRelaySet.fromRelayUrls(walletRelays, ndk);

      const walletEvent = await ndk.fetchEvent(
        {
          kinds: [NDKKind.CashuWallet],
          authors: [activeUser.pubkey],
        },
        {
          closeOnEose: true,
          cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
        },
        relaySet,
      );

      if (!walletEvent) {
        setCashuWallet(null);
        setCashuLoading(false);
        return;
      }

      try {
        const cashuWallet = new NDKCashuWallet(ndk);
        cashuWallet.relaySet = relaySet;

        await cashuWallet.loadFromEvent(walletEvent);
        await cashuWallet.start({
          since: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60,
          cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
        });

        setCashuWallet(cashuWallet);
      } catch (e) {
        console.error('Failed to initialize wallet:', e);
        setCashuError(`Failed to initialize wallet: ${e instanceof Error ? e.message : String(e)}`);
      }
    } catch (e) {
      console.error('Error fetching Cashu wallet:', e);
      setCashuError(`Failed to fetch wallet: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setCashuLoading(false);
    }
  }, [
    activeUser?.pubkey,
    ndk,
    fetchMintList,
    activeRelay,
    setCashuLoading,
    setCashuError,
    setCashuWallet,
  ]);

  const payInvoiceWithCashu = useCallback(
    async (invoice: string): Promise<boolean> => {
      if (!cashuWallet) {
        setCashuError('Cashu wallet not available');
        return false;
      }

      try {
        const result = await cashuWallet.lnPay({
          pr: invoice,
          paymentDescription: 'Zap payment via Cashu',
        });

        if (result) {
          return true;
        } else {
          setCashuError('Cashu payment failed');
          return false;
        }
      } catch (e) {
        console.error('Error paying with Cashu:', e);
        setCashuError(`Cashu payment failed: ${e instanceof Error ? e.message : String(e)}`);
        return false;
      }
    },
    [cashuWallet, setCashuError],
  );

  useEffect(() => {
    if (ndk && activeUser?.pubkey && loginData?.privateKey) {
      fetchWallet();
    } else {
      clearCashuWallet();
    }
  }, [ndk, activeUser?.pubkey, loginData?.privateKey, fetchWallet, clearCashuWallet]);

  const balance = cashuWallet && cashuWallet.balance ? cashuWallet.balance.amount || 0 : 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWallet();
    setRefreshing(false);
  };

  return {
    wallet: cashuWallet,
    mintList: cashuMintList,
    loading: cashuLoading,
    error: cashuError,
    balance,
    hasWallet: !!cashuWallet,
    refetch: fetchWallet,
    payInvoiceWithCashu,
    refreshing,
    handleRefresh,
    navigate,
  };
};
