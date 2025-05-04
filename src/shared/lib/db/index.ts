import { NostrEvent } from '@nostr-dev-kit/ndk';
import Dexie, { Table } from 'dexie';
import { Nip29GroupChat } from 'nostr-hooks/nip29';

export interface CachedGroupMessage extends Nip29GroupChat {
  groupId: string;
}

export interface CachedEvent {
  nostrLink: string;
  event: NostrEvent;
  timestamp: number;
}

export interface DbConfig {
  maxMessagesPerGroup: number;
  maxTotalMessages: number;
  maxCachedEvents: number;
}

export const DEFAULT_DB_CONFIG: DbConfig = {
  maxMessagesPerGroup: 500,
  maxTotalMessages: 5000,
  maxCachedEvents: 1000,
};

export class AppDatabase extends Dexie {
  groupMessages!: Table<CachedGroupMessage, string>;
  cachedEvents!: Table<CachedEvent, string>;
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

    this.config = {
      ...DEFAULT_DB_CONFIG,
      ...config,
    };
  }
}

const db = new AppDatabase();
export default db;
