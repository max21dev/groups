import { NDKEvent, NDKKind, NDKTag } from '@nostr-dev-kit/ndk';
import { useNdk, useProfile } from 'nostr-hooks';
import { useEffect, useMemo, useState } from 'react';

import { useCashuWallet } from '@/features/users/user-wallets/components/cashu-wallet/hooks';
import { useWalletStore } from '@/features/users/user-wallets/store';

import { useToast } from '@/shared/components/ui/use-toast';
import { ellipsis } from '@/shared/utils';

import { useLoginModalState, useZapModalState } from '@/shared/hooks';

import { ZAP_AMOUNTS } from '../config';
import { payInvoiceByWebln, safeParsePubkey } from '../utils';

export const useZapModal = () => {
  const { walletCodes, getWalletInstance } = useWalletStore();
  const { wallet: cashuWallet, mintList, payInvoiceWithCashu, hasWallet } = useCashuWallet();

  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState(ZAP_AMOUNTS[0]);
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);

  const { toast } = useToast();

  const { ndk } = useNdk();

  const { openLoginModal } = useLoginModalState();
  const { zapTarget, setZapTarget, isZapModalOpen, setIsZapModalOpen } = useZapModalState();

  const { profile } = useProfile({ pubkey: zapTarget?.pubkey });

  useEffect(() => {
    if (isZapModalOpen) {
      setSelectedWallet('');
    }
  }, [isZapModalOpen]);

  const process = async () => {
    if (!zapTarget) return;

    setProcessing(true);

    if (!ndk?.signer) {
      toast({ description: 'You need to login first!' });
      openLoginModal();
      setProcessing(false);
      return;
    }

    const extraTags: NDKTag[] | undefined =
      zapTarget instanceof NDKEvent ? [['e', zapTarget.id]] : undefined;

    try {
      const zapRequestEvent = new NDKEvent(ndk);
      zapRequestEvent.kind = NDKKind.ZapRequest;

      zapRequestEvent.tags = [
        ['p', zapTarget.pubkey],
        ['amount', (selectedAmount.amount * 1000).toString()],
        ['relays', ...Array.from(ndk.pool.relays.keys())],
      ];

      if (comment) zapRequestEvent.content = comment;

      if (extraTags) zapRequestEvent.tags.push(...extraTags);

      await zapRequestEvent.sign();

      let lightningAddress;

      const lud16 = profile?.lud16;
      const lud06 = profile?.lud06;

      if (!lud16 && !lud06) {
        const user = ndk.getUser({ pubkey: zapTarget.pubkey });
        await user.fetchProfile();

        lightningAddress = user.profile?.lud16 || user.profile?.lud06;

        if (!lightningAddress) {
          throw new Error('User does not have a Lightning address');
        }
      } else {
        lightningAddress = lud16 || lud06;
      }

      let lnurlEndpoint;

      if (lightningAddress?.includes('@')) {
        const [name, domain] = lightningAddress.split('@');
        const response = await fetch(`https://${domain}/.well-known/lnurlp/${name}`);
        if (!response.ok) throw new Error('Failed to fetch Lightning address data');

        const lnurlData = await response.json();
        lnurlEndpoint = lnurlData.callback;

        if (!lnurlEndpoint) {
          throw new Error('Invalid Lightning address data');
        }
      } else {
        // TODO: LUD-06 (LNURL)
        throw new Error('LNURL format not supported in manual implementation');
      }

      const zapRequestJson = JSON.stringify(zapRequestEvent.rawEvent());
      const callbackUrl = `${lnurlEndpoint}?amount=${selectedAmount.amount * 1000}&nostr=${encodeURIComponent(zapRequestJson)}`;

      const invoiceResponse = await fetch(callbackUrl);
      if (!invoiceResponse.ok) throw new Error('Failed to get Lightning invoice');

      const invoiceData = await invoiceResponse.json();
      const invoice = invoiceData.pr;

      if (!invoice || typeof invoice !== 'string') {
        throw new Error('Invalid invoice received');
      }

      if (selectedWallet === 'cashu') {
        if (!cashuWallet) {
          throw new Error('Cashu wallet not available');
        }

        const success = await payInvoiceWithCashu(invoice);
        if (!success) throw new Error('Cashu payment failed');
      } else if (selectedWallet) {
        const client = await getWalletInstance(selectedWallet);
        if (!client) throw new Error('Failed to get wallet');
        await client.payInvoice(invoice);
      } else {
        const ok = await payInvoiceByWebln(invoice);
        if (!ok) throw new Error('WebLN payment failed');
      }

      toast({ title: 'Successful ⚡️⚡️⚡️' });
      setZapTarget(undefined);
      setIsZapModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast({ title: err.message || 'Failed', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const walletDisplayName = useMemo(() => {
    if (selectedWallet === 'cashu') {
      return `Cashu Wallet (${ellipsis(mintList?.pubkey || '', 8)})`;
    }
    if (selectedWallet === '') {
      return 'Browser Wallet (WebLN)';
    }
    return ellipsis(selectedWallet, 40);
  }, [selectedWallet, mintList]);

  return {
    selectedAmount,
    setSelectedAmount,
    comment,
    setComment,
    processing,
    process,
    isZapModalOpen,
    setIsZapModalOpen,
    displayName: profile?.displayName,
    image: profile?.image,
    walletCodes,
    selectedWallet,
    setSelectedWallet,
    safeParsePubkey,
    cashuPubkey: mintList?.pubkey,
    hasWallet,
    walletDisplayName,
  };
};
