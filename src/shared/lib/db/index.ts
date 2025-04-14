import Dexie, { Table } from 'dexie';
import { Nip29GroupChat } from 'nostr-hooks/nip29';

export interface CachedGroupMessage extends Nip29GroupChat {
  groupId: string;
}

export class AppDatabase extends Dexie {
  groupMessages!: Table<CachedGroupMessage, string>;

  constructor() {
    super('MyAppDatabase');
    this.version(1).stores({
      groupMessages: 'id, groupId, pubkey, timestamp',
    });
  }
}

const db = new AppDatabase();
export default db;
