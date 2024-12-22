import { useCallback, useEffect, useState } from 'react';

import { NDKRelaySet, NDKSubscriptionCacheUsage } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';

import { useToast } from '@/shared/components/ui/use-toast';

import { AddressCategory, NostrEvent } from '../types';

export const useAddressPreview = (address: string) => {
  const [eventData, setEventData] = useState<NostrEvent | null>(null);
  const [category, setCategory] = useState<AddressCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const { ndk } = useNdk();

  const fetchData = useCallback(async () => {
    if (!ndk) {
      toast({
        title: 'Error',
        description: 'NDK instance is not available.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const decoded = nip19.decode(address);

      if (decoded.type !== 'naddr') {
        toast({
          title: 'Error',
          description: 'Invalid address type. Expected "naddr".',
          variant: 'destructive',
        });
        throw new Error("Invalid address type. Expected 'naddr'.");
      }

      const { identifier, pubkey, kind, relays = [] } = decoded.data;
      const relaySet = NDKRelaySet.fromRelayUrls(
        relays.length > 0 ? relays : ['wss://relay.nostr.band'],
        ndk,
      );

      const event = await ndk.fetchEvent(
        { kinds: [kind], authors: [pubkey], '#d': [identifier] },
        {
          closeOnEose: true,
          cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
        },
        relaySet,
      );

      if (event) {
        const rawEvent = event.rawEvent() as NostrEvent;
        setEventData(rawEvent);

        let determinedCategory: AddressCategory | null = null;

        if (kind === 30000) {
          determinedCategory = 'usersList';
        } else if (kind >= 39000 && kind <= 39009) {
          determinedCategory = 'group';
        }

        setCategory(determinedCategory);
      } else {
        setEventData(null);
        setCategory(null);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'An error occurred while fetching data.',
        variant: 'destructive',
      });
      setEventData(null);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  }, [address, ndk, toast]);

  useEffect(() => {
    fetchData();

    return () => {
      setEventData(null);
      setCategory(null);
      setLoading(false);
    };
  }, [fetchData]);

  return { eventData, category, loading };
};