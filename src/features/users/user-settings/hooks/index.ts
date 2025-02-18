import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useActiveUser, useLogin, useNdk } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { useStore } from '@/shared/store';

import {
  decryptUserSettings,
  deserializeSettings,
  encryptUserSettings,
  serializeSettings,
} from '../utils';

export const useUserSettings = () => {
  const [eventId, setEventId] = useState<string | null>(null);

  const { userSettings, setUserSettings } = useStore();
  const { loginData } = useLogin();
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
      setEventId(settingsEvent.id);

      try {
        if (!loginData.privateKey) return;

        const decryptedData = decryptUserSettings(
          settingsEvent.content,
          loginData.privateKey,
          activeUser.pubkey,
        );

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

  const publishDefaultUserSettings = async () => {
    if (!ndk || !activeUser || !loginData.privateKey) return;

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
      loginData.privateKey,
      activeUser.pubkey,
    );

    const newEvent = new NDKEvent(ndk, {
      kind: 30078,
      content: encryptedData,
      created_at: Math.floor(Date.now() / 1000),
      pubkey: activeUser.pubkey,
      tags: [['d', 'user-groups-settings']],
    });

    try {
      await newEvent.publish();
      setEventId(newEvent.id);
    } catch (error) {
      console.error('Error publishing default user settings event:', error);
    }
  };

  const updateUserSettings = async (newSettings: Partial<typeof userSettings>) => {
    if (!ndk || !activeUser || !loginData.privateKey) return;

    const updatedSettings = {
      ...userSettings,
      ...newSettings,
    };

    setUserSettings(updatedSettings);

    const encryptedData = encryptUserSettings(
      serializeSettings(updatedSettings),
      loginData.privateKey,
      activeUser.pubkey,
    );

    const updatedEvent = new NDKEvent(ndk, {
      kind: 30078,
      content: encryptedData,
      created_at: Math.floor(Date.now() / 1000),
      pubkey: activeUser.pubkey,
      tags: [['d', 'user-groups-settings'], ...(eventId ? [['e', eventId]] : [])],
    });

    try {
      await updatedEvent.publish();
      setEventId(updatedEvent.id);
    } catch (error) {
      console.error('Error publishing user settings event:', error);
    }
  };

  const updateLastSeenGroup = async (relay: string | undefined, groupId: string | undefined) => {
    if (!ndk || !activeUser || !loginData.privateKey || !groupId || !relay) return;

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
      loginData.privateKey,
      activeUser.pubkey,
    );

    const updatedEvent = new NDKEvent(ndk, {
      kind: 30078,
      content: encryptedData,
      created_at: Math.floor(Date.now() / 1000),
      pubkey: activeUser.pubkey,
      tags: [['d', 'user-groups-settings'], ...(eventId ? [['e', eventId]] : [])],
    });

    try {
      await updatedEvent.publish();
      setEventId(updatedEvent.id);
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
