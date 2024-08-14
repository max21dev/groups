import { NDKEvent } from '@nostr-dev-kit/ndk';

export type Group = {
  id: string;
  name: string;
  picture: string;
  about: string;
  privacy: 'public' | 'private';
  type: 'open' | 'closed';
  admins: GroupAdmin[];
  members: GroupMember[];
  event: NDKEvent;
};

export type GroupAdmin = {
  publicKey: string;
  permissions: GroupAdminPermission[];
};

export type GroupMember = {
  publicKey: string;
};

export type GroupAdminPermission =
  | 'add-user'
  | 'edit-metadata'
  | 'delete-event'
  | 'remove-user'
  | 'add-permission'
  | 'remove-permission'
  | 'edit-group-status'
  | 'create-group';

export type GroupMessage = {
  id: string;
  groupId: string;
  authorPublicKey: string;
  content: string;
  createdAt: number;
  event: NDKEvent;
  replyTo?: string | null;
};
export type GroupReply = {
  id: string;
  groupId: string;
  groupMessageId: string;
  authorPublicKey: string;
  content: string;
  createdAt: string;
};

export type LimitFilter = {
  since?: number;
  until?: number;
  limit?: number;
};
