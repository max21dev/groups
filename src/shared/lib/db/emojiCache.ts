import db, { CachedEmojiSet } from './index';

export interface EmojiSet {
  id: string;
  name: string;
  address: string;
  emojis: { name: string; image: string }[];
  author: string;
  createdAt: number;
}

export const loadCachedEmojiSets = async (): Promise<EmojiSet[]> => {
  try {
    const rows = await db.emojiSets.orderBy('createdAt').reverse().toArray();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      address: r.address,
      emojis: r.emojis,
      author: r.author,
      createdAt: r.createdAt,
    }));
  } catch (err) {
    console.error('Error loading emoji sets from IndexedDB:', err);
    return [];
  }
};

export const upsertEmojiSetsInCache = async (sets: EmojiSet[]): Promise<void> => {
  if (!sets?.length) return;

  try {
    const now = Date.now();
    await db.transaction('rw', db.emojiSets, async () => {
      const records: CachedEmojiSet[] = sets.map((s) => ({
        address: s.address,
        id: s.id,
        name: s.name,
        emojis: s.emojis,
        author: s.author,
        createdAt: s.createdAt,
        updatedAt: now,
      }));
      await db.emojiSets.bulkPut(records);

      const total = await db.emojiSets.count();
      if (total > db.config.maxEmojiSets) {
        const removeCount = total - db.config.maxEmojiSets;
        const olds = await db.emojiSets.orderBy('createdAt').limit(removeCount).toArray();
        for (const row of olds) {
          await db.emojiSets.delete(row.address);
        }
      }
    });
  } catch (err) {
    console.error('Error upserting emoji sets to IndexedDB:', err);
  }
};

export const clearEmojiSetsCache = async (): Promise<void> => {
  try {
    await db.emojiSets.clear();
  } catch (err) {
    console.error('Error clearing emoji sets cache:', err);
  }
};
