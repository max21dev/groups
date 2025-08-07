import { NDKKind, NDKRelaySet, NDKSubscriptionCacheUsage, NDKUser } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk } from 'nostr-hooks';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { discoveryRelays } from '@/features/users/user-wallets/configs';
import { useWalletStore } from '@/features/users/user-wallets/store';
import type { CashuTransaction } from '@/features/users/user-wallets/types';

import { useCopyToClipboard } from '@/shared/hooks';

export const useCashuWalletDetail = () => {
  const {
    cashuWallet: wallet,
    cashuMintList: mintList,
    cashuLoading: loading,
    cashuError: error,
    cashuTransactions: transactions,
    setCashuTransactions,
  } = useWalletStore();

  const { ndk } = useNdk();
  const { activeUser } = useActiveUser();
  const { copyToClipboard, hasCopied } = useCopyToClipboard();
  const { copyToClipboard: copyPrivateKeyToClipboard, hasCopied: hasCopiedPrivateKey } =
    useCopyToClipboard();
  const navigate = useNavigate();

  const fetchTransactions = useCallback(async () => {
    if (!wallet || !activeUser?.pubkey || !ndk) {
      return;
    }

    try {
      const filter = {
        kinds: [NDKKind.CashuWalletTx],
        authors: [activeUser.pubkey],
      };

      const relaySet = wallet.relaySet || NDKRelaySet.fromRelayUrls(discoveryRelays, ndk);

      const txEvents = await ndk.fetchEvents(
        filter,
        {
          closeOnEose: true,
          cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
        },
        relaySet,
      );

      const parsedTransactions: CashuTransaction[] = [];

      for (const event of txEvents) {
        try {
          await event.decrypt(new NDKUser({ pubkey: activeUser.pubkey }), undefined, 'nip44');

          const tags = JSON.parse(event.content) as string[][];

          const direction = (tags.find((t) => t[0] === 'direction')?.[1] || 'out') as 'in' | 'out';
          const amount = parseInt(tags.find((t) => t[0] === 'amount')?.[1] || '0');
          const unit = tags.find((t) => t[0] === 'unit')?.[1] || 'sat';
          const mint = tags.find((t) => t[0] === 'mint')?.[1];
          const description = tags.find((t) => t[0] === 'description')?.[1];
          const fee = parseInt(tags.find((t) => t[0] === 'fee')?.[1] || '0');

          const createdTokens = tags
            .filter((t) => t[0] === 'e' && t[3] === 'created')
            .map((t) => t[1]);

          const destroyedTokenIds = tags
            .filter((t) => t[0] === 'e' && t[3] === 'destroyed')
            .map((t) => t[1]);

          if (amount && mint) {
            parsedTransactions.push({
              id: event.id,
              direction,
              amount,
              unit,
              mint,
              description,
              fee,
              createdAt: event.created_at || 0,
              createdTokens,
              destroyedTokens: destroyedTokenIds,
            });
          }
        } catch (e) {
          console.warn('Failed to parse transaction:', e);
        }
      }

      parsedTransactions.sort((a, b) => b.createdAt - a.createdAt);
      setCashuTransactions(parsedTransactions);

      return parsedTransactions;
    } catch (e) {
      console.error('Error fetching transactions:', e);
      return [];
    }
  }, [wallet, activeUser?.pubkey, ndk, setCashuTransactions]);

  useEffect(() => {
    if (wallet) {
      fetchTransactions();
    }
  }, [wallet, fetchTransactions]);

  const balance = wallet && wallet.balance ? wallet.balance.amount || 0 : 0;

  return {
    wallet,
    mintList,
    loading,
    error,
    transactions,
    balance,
    fetchTransactions,
    copyToClipboard,
    hasCopied,
    copyPrivateKeyToClipboard,
    hasCopiedPrivateKey,
    navigate,
  };
};
