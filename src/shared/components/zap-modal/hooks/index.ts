import { NDKEvent, NDKTag } from '@nostr-dev-kit/ndk';
import { useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

import {
  useGlobalProfile,
  useLoginModalState,
  useZapModalState,
  useGlobalNdk,
} from '@/shared/hooks';

import { ZAP_AMOUNTS } from '../config';
import { payInvoiceByWebln } from '../utils';

export const useZapModal = () => {
  const [selectedAmount, setSelectedAmount] = useState(ZAP_AMOUNTS[0]);
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);

  const { toast } = useToast();

  const { globalNdk } = useGlobalNdk();

  const { openLoginModal } = useLoginModalState();
  const { zapTarget, setZapTarget, isZapModalOpen, setIsZapModalOpen } = useZapModalState();

  const { profile } = useGlobalProfile({ pubkey: zapTarget?.pubkey });

  const process = () => {
    if (!zapTarget) return;

    setProcessing(true);

    if (!globalNdk.signer) {
      toast({ description: 'You need to login first!' });
      openLoginModal();
      setProcessing(false);
      return;
    }

    const extraTags: NDKTag[] | undefined =
      zapTarget instanceof NDKEvent ? [['e', zapTarget.id]] : undefined;

    const ndkUser = globalNdk.getUser({ pubkey: zapTarget.pubkey });
    ndkUser.zap(selectedAmount.amount * 1000, comment, extraTags).then((invoice) => {
      if (typeof invoice === 'string') {
        payInvoiceByWebln(invoice)
          .then((res) => {
            if (res) {
              toast({ title: 'Successful ⚡️⚡️⚡️' });
              setZapTarget(undefined);
              setIsZapModalOpen(false);
            } else {
              toast({ title: 'Failed', variant: 'destructive' });
            }
          })
          .finally(() => setProcessing(false));
      } else {
        toast({ title: 'Failed', variant: 'destructive' });
        setProcessing(false);
      }
    });
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
  };
};
