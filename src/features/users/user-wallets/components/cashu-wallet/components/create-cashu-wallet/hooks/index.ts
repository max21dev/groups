import { NDKEvent, NDKKind, NDKRelaySet } from '@nostr-dev-kit/ndk';
import { NDKCashuWallet } from '@nostr-dev-kit/ndk-wallet';
import { useActiveUser, useLogin, useNdk } from 'nostr-hooks';
import { useCallback, useState } from 'react';

import { discoveryRelays } from '@/features/users/user-wallets/configs';
import { useWalletStore } from '@/features/users/user-wallets/store';

export const useCreateCashuWallet = () => {
  const { setCashuWallet, setCashuMintList, setCashuLoading, setCashuError } = useWalletStore();

  const { ndk } = useNdk();
  const { activeUser } = useActiveUser();
  const { loginData } = useLogin();

  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [mintInput, setMintInput] = useState('');
  const [relayInput, setRelayInput] = useState('');

  const [selectedMints, setSelectedMints] = useState<string[]>([]);
  const [selectedRelays, setSelectedRelays] = useState<string[]>([...discoveryRelays]);

  const [availableRelays, setAvailableRelays] = useState<string[]>([...discoveryRelays]);

  const handleAddMint = () => {
    if (!mintInput.trim() || !mintInput.startsWith('https://')) return;

    if (!selectedMints.includes(mintInput)) {
      setSelectedMints([...selectedMints, mintInput]);
    }
    setMintInput('');
  };

  const handleAddRelay = () => {
    if (!relayInput.trim() || !relayInput.startsWith('wss://')) return;

    if (!availableRelays.includes(relayInput)) {
      setAvailableRelays([...availableRelays, relayInput]);
      setSelectedRelays([...selectedRelays, relayInput]);
    }
    setRelayInput('');
  };

  const toggleRelay = (relay: string) => {
    if (selectedRelays.includes(relay)) {
      if (selectedRelays.length === 1) return;
      setSelectedRelays(selectedRelays.filter((r) => r !== relay));
    } else {
      setSelectedRelays([...selectedRelays, relay]);
    }
  };

  const removeMint = (mint: string) => {
    setSelectedMints(selectedMints.filter((m) => m !== mint));
  };

  const createWallet = useCallback(
    async (mints: string[], userSelectedRelays: string[]) => {
      if (!ndk || !activeUser?.pubkey || !loginData?.privateKey) {
        setCashuError('Missing required data to create wallet');
        return false;
      }

      if (mints.length === 0 || userSelectedRelays.length === 0) {
        setCashuError('No mints or relays specified');
        return false;
      }

      setCashuLoading(true);
      setCashuError(null);

      try {
        const cashuWallet = new NDKCashuWallet(ndk);
        cashuWallet.mints = mints;
        cashuWallet.relaySet = NDKRelaySet.fromRelayUrls(userSelectedRelays, ndk);

        const p2pk = await cashuWallet.getP2pk();

        await cashuWallet.publish();

        const mintListEvent = new NDKEvent(ndk);
        mintListEvent.kind = NDKKind.CashuMintList;
        mintListEvent.content = '';
        mintListEvent.tags = [
          ['pubkey', p2pk],
          ...userSelectedRelays.map((r) => ['relay', r]),
          ...mints.map((m) => ['mint', m]),
        ];

        const allRelaysForMintList = Array.from(
          new Set([...userSelectedRelays, ...discoveryRelays]),
        );

        await mintListEvent.publish(NDKRelaySet.fromRelayUrls(allRelaysForMintList, ndk));

        await cashuWallet.start();

        setCashuWallet(cashuWallet);
        setCashuMintList({ mints, relays: userSelectedRelays, pubkey: p2pk });

        return true;
      } catch (err) {
        console.error('Error creating wallet:', err);
        setCashuError(
          `Failed to create wallet: ${err instanceof Error ? err.message : String(err)}`,
        );
        return false;
      } finally {
        setCashuLoading(false);
      }
    },
    [
      ndk,
      activeUser?.pubkey,
      loginData?.privateKey,
      setCashuWallet,
      setCashuMintList,
      setCashuLoading,
      setCashuError,
    ],
  );

  const handleCreateWallet = async () => {
    if (selectedMints.length === 0 || selectedRelays.length === 0) return;

    setIsCreating(true);
    const success = await createWallet(selectedMints, selectedRelays);

    if (success) {
      setIsOpen(false);
      resetForm();
    }

    setIsCreating(false);
    return success;
  };

  const resetForm = () => {
    setSelectedMints([]);
    setSelectedRelays([...discoveryRelays]);
    setAvailableRelays([...discoveryRelays]);
    setMintInput('');
    setRelayInput('');
  };

  return {
    isOpen,
    setIsOpen,
    isCreating,
    mintInput,
    setMintInput,
    relayInput,
    setRelayInput,
    selectedMints,
    selectedRelays,
    availableRelays,
    handleAddMint,
    handleAddRelay,
    toggleRelay,
    removeMint,
    handleCreateWallet,
    resetForm,
  };
};
