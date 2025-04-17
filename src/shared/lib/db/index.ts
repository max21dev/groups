import Dexie, { Table } from 'dexie';
import { Nip29GroupChat } from 'nostr-hooks/nip29';

export interface CachedGroupMessage extends Nip29GroupChat {
  groupId: string;
}

export interface DbConfig {
  maxMessagesPerGroup: number;
  maxTotalMessages: number;
}

export const DEFAULT_DB_CONFIG: DbConfig = {
  maxMessagesPerGroup: 500,
  maxTotalMessages: 5000,
};

export class AppDatabase extends Dexie {
  groupMessages!: Table<CachedGroupMessage, string>;
  config: DbConfig;

  constructor(config: Partial<DbConfig> = {}) {
    super('MyAppDatabase');
    this.version(1).stores({
      groupMessages: 'id, groupId, pubkey, timestamp',
    });

    this.config = {
      ...DEFAULT_DB_CONFIG,
      ...config,
    };
  }
}

const db = new AppDatabase();
export default db;
