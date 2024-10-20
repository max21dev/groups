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

export const enum Kind {
  KindProfileMetadata = 0,
  KindTextNote = 1,
  KindRecommendServer = 2,
  KindContactList = 3,
  KindEncryptedDirectMessage = 4,
  KindDeletion = 5,
  KindRepost = 6,
  KindReaction = 7,
  KindSimpleGroupChatMessage = 9,
  KindSimpleGroupThread = 11,
  KindSimpleGroupReply = 12,
  KindChannelCreation = 40,
  KindChannelMetadata = 41,
  KindChannelMessage = 42,
  KindChannelHideMessage = 43,
  KindChannelMuteUser = 44,
  KindPatch = 1617,
  KindFileMetadata = 1063,
  KindSimpleGroupAddUser = 9000,
  KindSimpleGroupRemoveUser = 9001,
  KindSimpleGroupEditMetadata = 9002,
  KindSimpleGroupAddPermission = 9003,
  KindSimpleGroupRemovePermission = 9004,
  KindSimpleGroupDeleteEvent = 9005,
  KindSimpleGroupEditGroupStatus = 9006,
  KindSimpleGroupCreateGroup = 9007,
  KindSimpleGroupDeleteGroup = 9008,
  KindSimpleGroupJoinRequest = 9021,
  KindSimpleGroupLeaveRequest = 9022,
  KindZapRequest = 9734,
  KindZap = 9735,
  KindMuteList = 10000,
  KindPinList = 10001,
  KindRelayListMetadata = 10002,
  KindNWCWalletInfo = 13194,
  KindClientAuthentication = 22242,
  KindNWCWalletRequest = 23194,
  KindNWCWalletResponse = 23195,
  KindNostrConnect = 24133,
  KindCategorizedPeopleList = 30000,
  KindCategorizedBookmarksList = 30001,
  KindProfileBadges = 30008,
  KindBadgeDefinition = 30009,
  KindStallDefinition = 30017,
  KindProductDefinition = 30018,
  KindArticle = 30023,
  KindApplicationSpecificData = 30078,
  KindRepositoryAnnouncement = 30617,
  KindRepositoryState = 30618,
  KindSimpleGroupMetadata = 39000,
  KindSimpleGroupAdmins = 39001,
  KindSimpleGroupMembers = 39002
}
