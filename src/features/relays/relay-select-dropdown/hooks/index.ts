import { useState } from 'react';

import { useSidebar } from '@/shared/components/sidebar/hooks';
import { useToast } from '@/shared/components/ui/use-toast';

import { useActiveGroup, useActiveRelay } from '@/shared/hooks';
import { useStore } from '@/shared/store';

import { validateURL } from '../utils';

export const useRelaySelectDropDown = () => {
  const [relayInput, setRelayInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const relays = useStore((state) => state.relays);
  const addRelay = useStore((state) => state.addRelay);
  const safeRemoveRelay = useStore((state) => state.safeRemoveRelay);
  const isCollapsed = useStore((state) => state.isCollapsed);
  const { isMobile } = useSidebar();

  const { toast } = useToast();

  const { setActiveGroupId } = useActiveGroup();
  const { activeRelay, setActiveRelay } = useActiveRelay();

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
    activeRelay,
    isCollapsed,
    handleAddNewRelay,
    handleDeleteRelay,
    setActiveRelay,
    setActiveGroupId,
    isMobile,
  };
};
