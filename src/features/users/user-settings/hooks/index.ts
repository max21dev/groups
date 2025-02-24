import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk } from 'nostr-hooks';
import { useEffect, useRef } from 'react';

import { useStore } from '@/shared/store';

import {
  decryptUserSettings,
  deserializeSettings,
  encryptUserSettings,
  serializeSettings,
} from '../utils';

export const useUserSettings = () => {
  const eventIdRef = useRef<string | null>(null);

  const { userSettings, setUserSettings } = useStore();
  const { activeUser } = useActiveUser();
  const { ndk } = useNdk();

  useEffect(() => {
    if (activeUser && ndk) {
      fetchUserSettings();
    }
  }, [activeUser, ndk]);

  const fetchUserSettings = async () => {
    if (!ndk || !activeUser) return;

    const events = await ndk.fetchEvents({
      kinds: [30078],
      authors: [activeUser.pubkey],
    });

    const settingsEvent = Array.from(events).find((event) =>
      event.tags.some((tag) => tag[0] === 'd' && tag[1] === 'user-groups-settings'),
    );

    if (settingsEvent) {
      eventIdRef.current = settingsEvent.id;

      try {
        const decryptedData = decryptUserSettings(settingsEvent.content, activeUser.pubkey);

        if (!decryptedData) {
          publishDefaultUserSettings(settingsEvent.id);
          return;
        }

        if (!decryptedData.created_at) {
          decryptedData.created_at = Math.floor(Date.now() / 1000);
        }

        setUserSettings(deserializeSettings(decryptedData));
      } catch (error) {
        console.error('Error decrypting user settings');
      }
    } else {
      publishDefaultUserSettings();
    }
  };

  const publishDefaultUserSettings = async (previousEventId?: string) => {
    if (!ndk || !activeUser) return;

    const defaultSettings = {
      not_joined_groups: true,
      admin_groups: true,
      member_groups: true,
      notif_exceptions: new Map(),
      last_seen_groups: new Map(),
      created_at: Math.floor(Date.now() / 1000),
    };

    setUserSettings(defaultSettings);

    const encryptedData = encryptUserSettings(
      serializeSettings(defaultSettings),
      activeUser.pubkey,
    );

    const newEvent = new NDKEvent(ndk, {
      kind: 30078,
      content: encryptedData,
      created_at: Math.floor(Date.now() / 1000),
      pubkey: activeUser.pubkey,
      tags: [['d', 'user-groups-settings'], ...(previousEventId ? [['e', previousEventId]] : [])],
    });

    try {
      await newEvent.publish();
      eventIdRef.current = newEvent.id;
    } catch (error) {
      console.error('Error publishing default user settings event:', error);
    }
  };

  const updateUserSettings = async (newSettings: Partial<typeof userSettings>) => {
    if (!ndk || !activeUser) return;

    const updatedSettings = {
      ...userSettings,
      ...newSettings,
    };

    setUserSettings(updatedSettings);

    const encryptedData = encryptUserSettings(
      serializeSettings(updatedSettings),
      activeUser.pubkey,
    );

    const updatedEvent = new NDKEvent(ndk, {
      kind: 30078,
      content: encryptedData,
      created_at: Math.floor(Date.now() / 1000),
      pubkey: activeUser.pubkey,
      tags: [
        ['d', 'user-groups-settings'],
        ...(eventIdRef.current ? [['e', eventIdRef.current]] : []),
      ],
    });

    try {
      await updatedEvent.publish();
      eventIdRef.current = updatedEvent.id;
    } catch (error) {
      console.error('Error publishing user settings event:', error);
    }
  };

  const updateLastSeenGroup = async (relay: string | undefined, groupId: string | undefined) => {
    if (!ndk || !activeUser || !groupId || !relay) return;

    await fetchUserSettings();

    const updatedLastSeen = new Map(userSettings.last_seen_groups);

    if (!updatedLastSeen.has(relay)) {
      updatedLastSeen.set(relay, new Map<string, number>());
    }

    updatedLastSeen.get(relay)!.set(groupId, Math.floor(Date.now() / 1000));

    const updatedSettings = {
      ...userSettings,
      last_seen_groups: updatedLastSeen,
    };

    setUserSettings(updatedSettings);

    const encryptedData = encryptUserSettings(
      serializeSettings(updatedSettings),
      activeUser.pubkey,
    );

    const updatedEvent = new NDKEvent(ndk, {
      kind: 30078,
      content: encryptedData,
      created_at: Math.floor(Date.now() / 1000),
      pubkey: activeUser.pubkey,
      tags: [
        ['d', 'user-groups-settings'],
        ...(eventIdRef.current ? [['e', eventIdRef.current]] : []),
      ],
    });

    try {
      await updatedEvent.publish();
      eventIdRef.current = updatedEvent.id;
    } catch (error) {
      console.error('Error publishing user settings event:', error);
    }
  };

  return {
    userSettings,
    updateUserSettings,
    activeUser,
    updateLastSeenGroup,
  };
};
