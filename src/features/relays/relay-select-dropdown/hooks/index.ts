import { useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';

import { useStore } from '@/shared/store';

const validateURL = (url: string) => {
  const urlPattern = /^(wss?|ws):\/\/[^\s$.?#].[^\s]*$/i;

  return urlPattern.test(url);
};

export const useRelaySelectDropDown = () => {
  const [relayInput, setRelayInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const relays = useStore((state) => state.relays);
  const addRelay = useStore((state) => state.addRelay);
  const safeRemoveRelay = useStore((state) => state.safeRemoveRelay);
  const activeRelayIndex = useStore((state) => state.activeRelayIndex);
  const setActiveRelayIndex = useStore((state) => state.setActiveRelayIndex);
  const setActiveGroupId = useStore((state) => state.setActiveGroupId);
  const isCollapsed = useStore((state) => state.isCollapsed);

  const { toast } = useToast();

  const handleAddNewRelay = () => {
    if (!validateURL(relayInput)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid URL with wss, or ws protocol.',
        variant: 'destructive',
      });
      return;
    }

    if (relayInput) {
      addRelay(relayInput);
      setRelayInput('');
      setDialogOpen(false);
      setError('');
    }
  };

  const handleDeleteRelay = (relayToDelete: string) => {
    // TODO: Show a confirmation dialog
    safeRemoveRelay(relayToDelete);
  };

  return {
    relayInput,
    setRelayInput,
    dialogOpen,
    setDialogOpen,
    error,
    relays,
    activeRelayIndex,
    isCollapsed,
    handleAddNewRelay,
    handleDeleteRelay,
    setActiveRelayIndex,
    setActiveGroupId,
  };
};
