import { useEffect, useState } from 'react';

import { useNdk, useProfile } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';

export const useNotePreview = (note: string) => {
  const [event, setEvent] = useState<any | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const { ndk } = useNdk();
  const { profile } = useProfile({ pubkey: event?.pubkey });

  useEffect(() => {
    const fetchEvent = async () => {
      const decoded = nip19.decode(note);
      const isValid = !!decoded?.data;

      if (isValid) {
        setLink(`https://primal.net/e/${note}`);
      } else {
        setLink(null);
        return;
      }

      const eventId = decoded.data.toString();

      if (ndk) {
        try {
          const fetchedEvent = await ndk.fetchEvent(eventId);
          setEvent(fetchedEvent);
        } catch (error) {
          console.error('Error fetching event:', error);
          setEvent(null);
        }
      }
    };

    fetchEvent();
  }, [note, ndk]);

  return { event, profile, link };
};