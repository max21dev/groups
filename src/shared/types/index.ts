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

export type GroupMetadata = {
  id: string;
  name: string;
  picture: string;
  about: string;
};

export type GroupAdmin = {
  publicKey: string;
  permissions: GroupAdminPermission[];
};

export type GroupMember = {
  publicKey: string;
};

export enum GroupAdminPermissionEnum {
  AddUser = 'add-user',
  EditMetadata = 'edit-metadata',
  DeleteEvent = 'delete-event',
  RemoveUser = 'remove-user',
  AddPermission = 'add-permission',
  RemovePermission = 'remove-permission',
  EditGroupStatus = 'edit-group-status',
  CreateGroup = 'create-group',
  DeleteGroup = 'delete-group',
}

export type GroupAdminPermission = `${GroupAdminPermissionEnum}`;

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

export type GroupsFilter = {
  belongTo?: boolean;
  manage?: boolean;
  own?: boolean;
  notJoined?: boolean;
};
