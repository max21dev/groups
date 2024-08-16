import { useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

import { useGlobalNdk, useLoginParam, useProfile } from '@/shared/hooks';
import { useStore } from '@/shared/store';

import { ZAP_AMOUNTS } from '../config';
import { payInvoiceByWebln } from '../utils';

export const useZapModal = () => {
  const [selectedAmount, setSelectedAmount] = useState(ZAP_AMOUNTS[0]);
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);

  const zapTarget = useStore((state) => state.zapTarget);
  const setZapTarget = useStore((state) => state.setZapTarget);

  const { toast } = useToast();

  const { globalNdk } = useGlobalNdk();
  const { openLoginModal } = useLoginParam();

  const { profile } = useProfile({ pubkey: zapTarget?.pubkey });

  const process = () => {
    if (!zapTarget) return;

    setProcessing(true);

    if (!globalNdk.signer) {
      toast({ description: 'You need to login first!' });
      openLoginModal();
      setProcessing(false);
      return;
    }

    const u = globalNdk.getUser({ pubkey: zapTarget.pubkey });
    u.zap(selectedAmount.amount * 1000, comment).then((invoice) => {
      if (typeof invoice === 'string') {
        payInvoiceByWebln(invoice)
          .then((res) => {
            if (res) {
              toast({ title: 'Successful ⚡️⚡️⚡️' });
              setZapTarget(undefined);
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
    zapTarget,
    setZapTarget,
    displayName: profile?.displayName,
    image: profile?.image,
  };
};
