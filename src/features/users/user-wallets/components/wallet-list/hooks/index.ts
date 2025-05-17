import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NWCClient } from '@/features/users/user-wallets/lib';
import { useWalletStore } from '@/features/users/user-wallets/store';

import { useToast } from '@/shared/components/ui/use-toast';

export const useWalletList = () => {
  const { walletCodes, addWallet } = useWalletStore();
  const [input, setInput] = useState('');

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleConnect = () => {
    const trimmedInput = input.trim();

    try {
      new URL(trimmedInput);

      new NWCClient(trimmedInput);

      addWallet(trimmedInput);
      setInput('');
    } catch (e) {
      toast({
        title: 'Error connecting to wallet',
        description: 'Invalid wallet connection URL format',
        variant: 'destructive',
      });
    }
  };

  return {
    input,
    setInput,
    handleConnect,
    walletCodes,
    addWallet,
    navigate,
  };
};