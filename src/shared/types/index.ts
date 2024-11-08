import { NDKEvent } from '@nostr-dev-kit/ndk';

export type Group = {
  id: string;
  name: string;
  picture: string;
  about: string;
  privacy: 'public' | 'private';
  type: 'open' | 'closed';
  event: NDKEvent;
};

export type GroupMetadata = {
  id: string;
  name: string;
  picture: string;
  about: string;
};

export type GroupStatus = {
  id: string;
  privacy: 'public' | 'private';
  type: 'open' | 'closed';
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

export const GroupAdminAvailablePermission: GroupAdminPermission[] = [
  GroupAdminPermissionEnum.AddUser,
  GroupAdminPermissionEnum.EditMetadata,
  GroupAdminPermissionEnum.DeleteEvent,
  GroupAdminPermissionEnum.RemoveUser,
  GroupAdminPermissionEnum.AddPermission,
  GroupAdminPermissionEnum.RemovePermission,
  GroupAdminPermissionEnum.EditGroupStatus,
  GroupAdminPermissionEnum.CreateGroup,
  GroupAdminPermissionEnum.DeleteGroup,
];

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
