import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useNdk, useProfile } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';
import { useEffect, useState } from 'react';

export const useNotePreview = (note: string) => {
  const [event, setEvent] = useState<NDKEvent | null>();
  const [link, setLink] = useState<string>();
  const { ndk } = useNdk();
  const { profile } = useProfile({ pubkey: event?.pubkey });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!ndk) {
        return;
      }

      const decoded = nip19.decode(note);
      const isValid = !!decoded?.data;

      if (!isValid) {
        setLink(undefined);
        return;
      }

      setLink(`https://primal.net/e/${note}`);

      const eventId = decoded.data.toString();

      try {
        const fetchedEvent = await ndk.fetchEvent(eventId);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error('Error fetching event:', error);
        setEvent(undefined);
      }
    };

    fetchEvent();
  }, [note, ndk]);

  return { event, profile, link };
};
