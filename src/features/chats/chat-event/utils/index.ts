import { NDKEvent } from '@nostr-dev-kit/ndk';

import { EventCategory } from '../types';

export const EVENT_CATEGORY_MAP: Record<number, EventCategory> = {
  1: 'note',
  11: 'thread',
  1111: 'note',
  9: 'chat-message',
  20: 'picture',
  21: 'video',
  1068: 'poll',
  1337: 'code-snippet',
  9041: 'zap-goal',
  9802: 'highlight',
  10222: 'community',
  30000: 'follow-set',
  30009: 'badge-definition',
  30023: 'long-form-content',
  30030: 'emoji-set',
  30311: 'live-stream',
  30617: 'git-repo',
  30818: 'wiki',
  31923: 'calendar-event',
  31989: 'app-recommendation',
  31990: 'app-recommendation',
  39000: 'group',
};

export const fetchReactions = async (ndk: any, eventId: string): Promise<NDKEvent[]> => {
  if (!ndk) return [];

  const reactions = await ndk.fetchEvents({
    kinds: [7],
    '#e': [eventId],
  });

  return Array.from(reactions || []);
};

export const isExcludedCategory = (category: EventCategory): boolean => {
  const excluded: EventCategory[] = ['group', 'chat-message'];
  return excluded.includes(category);
};