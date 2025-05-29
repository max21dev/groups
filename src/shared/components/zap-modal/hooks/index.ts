import { NDKEvent, NDKTag } from '@nostr-dev-kit/ndk';
import { useNdk, useProfile } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { useWalletStore } from '@/features/users/user-wallets/store';

import { useToast } from '@/shared/components/ui/use-toast';

import { useLoginModalState, useZapModalState } from '@/shared/hooks';

import { ZAP_AMOUNTS } from '../config';
import { payInvoiceByWebln, safeParsePubkey } from '../utils';

export const useZapModal = () => {
  const { walletCodes, getWalletInstance } = useWalletStore();

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
    const ndkUser = ndk.getUser({ pubkey: zapTarget.pubkey });

    try {
      const invoice = await ndkUser.zap(selectedAmount.amount * 1000, comment, extraTags);
      if (typeof invoice !== 'string') throw new Error('Invalid invoice');

      if (selectedWallet) {
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
  };
};
