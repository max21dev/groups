import { NostrEvent } from '@nostr-dev-kit/ndk';
import db, { CachedEvent } from './index';

export const saveEvent = async (event: NostrEvent, nostrLink: string): Promise<void> => {
  try {
    const cachedEvent: CachedEvent = {
      nostrLink,
      event,
      timestamp: Date.now(),
    };

    await db.cachedEvents.put(cachedEvent);
    await cleanupEvents();
  } catch (error) {
    console.error('Error saving or cleaning up cached events:', error);
  }
};

const cleanupEvents = async (): Promise<void> => {
  try {
    const totalCount = await db.cachedEvents.count();

    if (totalCount > db.config.maxCachedEvents) {
      const eventsToRemove = await db.cachedEvents
        .orderBy('timestamp')
        .limit(totalCount - db.config.maxCachedEvents)
        .toArray();

      await db.transaction('rw', db.cachedEvents, async () => {
        for (const cachedEvent of eventsToRemove) {
          await db.cachedEvents.delete(cachedEvent.nostrLink);
        }
      });
    }
  } catch (error) {
    console.error('Error cleaning up cached events:', error);
  }
};

export const getEventByNostrLink = async (nostrLink: string): Promise<NostrEvent | null> => {
  try {
    const cachedEvent = await db.cachedEvents.get(nostrLink);

    if (cachedEvent) {
      await db.cachedEvents.update(nostrLink, { timestamp: Date.now() });
      return cachedEvent.event;
    }

    return null;
  } catch (error) {
    console.error('Error fetching event from cache:', error);
    return null;
  }
};
