import { NDKEvent } from '@nostr-dev-kit/ndk';

import { EmojiSet } from '@/shared/lib/db/emojiCache';

export const convertEventToEmojiSet = (event: NDKEvent): EmojiSet | null => {
  try {
    const d = event.tags.find((t) => t[0] === 'd')?.[1];
    if (!d) return null;

    const title = event.tags.find((t) => t[0] === 'title')?.[1];

    const emojiTags = event.tags.filter((t) => t[0] === 'emoji' && t[1] && t[2]);
    if (emojiTags.length > 0) {
      return {
        id: event.id,
        name: title || d,
        address: `30030:${event.pubkey}:${d}`,
        emojis: emojiTags.map((t) => ({ name: t[1], image: t[2] })),
        author: event.pubkey,
        createdAt: event.created_at || 0,
      };
    }

    if (event.content?.trim()) {
      try {
        const arr = JSON.parse(event.content);
        if (Array.isArray(arr)) {
          const valid = arr.filter(
            (e: any) => e && typeof e === 'object' && (e.name || e.shortcode) && (e.url || e.image),
          );
          if (valid.length) {
            return {
              id: event.id,
              name: title || d,
              address: `30030:${event.pubkey}:${d}`,
              emojis: valid.map((e: any) => ({
                name: e.name || e.shortcode || '',
                image: e.url || e.image || '',
              })),
              author: event.pubkey,
              createdAt: event.created_at || 0,
            };
          }
        }
      } catch {
        // ignore invalid JSON
      }
    }

    return null;
  } catch (error) {
    console.error('Error converting event to emoji set:', error);
    return null;
  }
};
