import { useLogin } from 'nostr-hooks';
import { nsecEncode } from 'nostr-tools/nip19';
import { generateSecretKey } from 'nostr-tools/pure';
import { useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

import { useLoginModalState } from '@/shared/hooks';

export const useLoginModal = () => {
  const [nip46Input, setNip46Input] = useState('');
  const [nsecInput, setNsecInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithPrivateKey, loginWithExtension, loginWithRemoteSigner } = useLogin();

  const { isLoginModalOpen, closeLoginModal, setIsLoginModalOpen } = useLoginModalState();

  const { toast } = useToast();

  const handleExtensionSigner = () => {
    setLoading(true);

    loginWithExtension({
      onError: (e) => {
        console.error(e);
        toast({ title: 'Error', description: String(e), variant: 'destructive' });
        setLoading(false);
      },
      onSuccess: () => {
        closeLoginModal();
        setLoading(false);
      },
    });
  };

  const handleRemoteSigner = () => {
    setLoading(true);

    loginWithRemoteSigner({
      nip46Address: nip46Input,
      onError: (e) => {
        console.error(e);
        toast({ title: 'Error', description: String(e), variant: 'destructive' });
        setLoading(false);
      },
      onSuccess: () => {
        closeLoginModal();
        setLoading(false);
      },
    });
  };

  const handlePrivateKeySigner = () => {
    setLoading(true);

    loginWithPrivateKey({
      privateKey: nsecInput,
      onError: (e) => {
        console.error(e);
        toast({ title: 'Error', description: String(e), variant: 'destructive' });
        setLoading(false);
      },
      onSuccess: () => {
        closeLoginModal();
        setLoading(false);
        setNsecInput('');
      },
    });
  };

  const handlePrivateKeyGenerate = () => {
    const sk = generateSecretKey();
    const nsec = nsecEncode(sk);
    setNsecInput(nsec);
  };

  return {
    loading,
    nip46Input,
    setNip46Input,
    nsecInput,
    setNsecInput,
    handleRemoteSigner,
    handleExtensionSigner,
    handlePrivateKeySigner,
    handlePrivateKeyGenerate,
    isLoginModalOpen,
    setIsLoginModalOpen,
  };
};
