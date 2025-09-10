import { NostrEvent } from '@nostr-dev-kit/ndk';
import Dexie, { Table } from 'dexie';
import { Nip29GroupChat } from 'nostr-hooks/nip29';

import { EmojiSet } from './emojiCache';

export interface CachedGroupMessage extends Nip29GroupChat {
  groupId: string;
}

export interface CachedEvent {
  nostrLink: string;
  event: NostrEvent;
  timestamp: number;
}

export interface CachedEmojiSet extends EmojiSet {
  updatedAt?: number;
}
export interface DbConfig {
  maxMessagesPerGroup: number;
  maxTotalMessages: number;
  maxCachedEvents: number;
  maxEmojiSets: number;
}

export const DEFAULT_DB_CONFIG: DbConfig = {
  maxMessagesPerGroup: 500,
  maxTotalMessages: 5000,
  maxCachedEvents: 1000,
  maxEmojiSets: 500,
};

export class AppDatabase extends Dexie {
  groupMessages!: Table<CachedGroupMessage, string>;
  cachedEvents!: Table<CachedEvent, string>;
  emojiSets!: Table<CachedEmojiSet, string>;
  config: DbConfig;

  constructor(config: Partial<DbConfig> = {}) {
    super('MyAppDatabase');
    this.version(1).stores({
      groupMessages: 'id, groupId, pubkey, timestamp',
    });

    this.version(2).stores({
      groupMessages: 'id, groupId, pubkey, timestamp',
      cachedEvents: 'nostrLink, timestamp',
    });

    this.version(3).stores({
      groupMessages: 'id, groupId, pubkey, timestamp',
      cachedEvents: 'nostrLink, timestamp',
      emojiSets: 'address, createdAt',
    });

    this.config = {
      ...DEFAULT_DB_CONFIG,
      ...config,
    };
  }
}

const db = new AppDatabase();
export default db;
