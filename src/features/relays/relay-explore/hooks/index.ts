import { NDKEvent, NDKSubscription } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useRef, useState } from 'react';

export const useRelayExplore = (activeRelay: string | undefined) => {
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(true);
  const [selectedKinds, setSelectedKinds] = useState<number[]>([1]);
  const [tempSelectedKinds, setTempSelectedKinds] = useState<number[]>([1]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const subscriptionRef = useRef<NDKSubscription | null>(null);
  const hasInitiallyLoaded = useRef(false);

  const { ndk } = useNdk();

  useEffect(() => {
    const subscribeToEvents = async () => {
      if (!ndk || !activeRelay || selectedKinds.length === 0 || !isSubscriptionActive) return;

      if (!hasInitiallyLoaded.current && events.length === 0) {
        setIsInitialLoading(true);
      }

      try {
        const filter = {
          kinds: selectedKinds,
          limit: 50,
        };

        const subscription = ndk.subscribe(filter);
        subscriptionRef.current = subscription;

        subscription.on('event', (event: NDKEvent) => {
          setEvents((prevEvents) => {
            const exists = prevEvents.some((e) => e.id === event.id);
            if (exists) return prevEvents;

            const updatedEvents = [event, ...prevEvents];
            return updatedEvents
              .sort((a, b) => (b.created_at || 0) - (a.created_at || 0))
              .slice(0, 50);
          });
        });

        subscription.on('eose', () => {
          if (!hasInitiallyLoaded.current) {
            setIsInitialLoading(false);
            hasInitiallyLoaded.current = true;
          }
        });

        subscription.start();
      } catch (error) {
        console.error('Error subscribing to relay events:', error);
        setIsInitialLoading(false);
        hasInitiallyLoaded.current = true;
      }
    };

    const stopSubscription = () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.stop();
        subscriptionRef.current = null;
      }
    };

    stopSubscription();

    if (ndk && activeRelay && isSubscriptionActive && selectedKinds.length > 0) {
      subscribeToEvents();
    }

    return () => {
      stopSubscription();
    };
  }, [ndk, activeRelay, isSubscriptionActive, selectedKinds]);

  const handleSubscriptionToggle = (checked: boolean) => {
    setIsSubscriptionActive(checked);
  };

  const handleTempKindToggle = (kind: number, checked: boolean) => {
    if (checked) {
      setTempSelectedKinds((prev) => [...prev, kind]);
    } else {
      if (tempSelectedKinds.length > 1) {
        setTempSelectedKinds((prev) => prev.filter((k) => k !== kind));
      }
    }
  };

  const handleApplyFilters = () => {
    setSelectedKinds(tempSelectedKinds);
    setEvents([]);
    hasInitiallyLoaded.current = false;
    setIsPopoverOpen(false);
  };

  const handleCancelFilters = () => {
    setTempSelectedKinds(selectedKinds);
    setIsPopoverOpen(false);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (open) {
      setTempSelectedKinds(selectedKinds);
    }
  };

  return {
    events,
    isInitialLoading,
    isSubscriptionActive,
    selectedKinds,
    tempSelectedKinds,
    isPopoverOpen,
    handleSubscriptionToggle,
    handleTempKindToggle,
    handleApplyFilters,
    handleCancelFilters,
    handlePopoverOpenChange,
  };
};
