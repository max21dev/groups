import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { AddressCategory } from '../types';

export const useAddressPreview = (address: string) => {
  const [eventData, setEventData] = useState<NDKEvent | null | undefined>(undefined);
  const [category, setCategory] = useState<AddressCategory | null | undefined>(undefined);

  const { ndk } = useNdk();

  useEffect(() => {
    if (!ndk) {
      return;
    }

    ndk.fetchEvent(address).then((event) => {
      if (event && event.kind) {
        if (event.kind === 30000) {
          setCategory('users-list');
        } else if (event.kind >= 39000 && event.kind <= 39009) {
          setCategory('group');
        }

        setEventData(event);
      } else {
        setEventData(null);
        setCategory(null);
      }
    });
  }, [address, ndk]);

  return { eventData, category };
};
