import { GroupAdminPermissionEnum, GroupMetadata } from '@/shared/types';
import { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';

export const createGroup = (
  activeUser: NDKUser | undefined,
  openLoginModal: () => void,
  createNewEvent: () => NDKEvent,
  groupMetadata: GroupMetadata,
  onSuccess?: () => void,
  onError?: () => void,
) => {
  if (!activeUser) {
    console.log('activeUser false ', activeUser);
    openLoginModal();
    return;
  }
  const event = createNewEvent();
  event.kind = 9007;
  event.tags = [['h', groupMetadata.id]];
  event.publish().then(
    (r) => {
      r.size > 0 ? onSuccess?.() : onError?.();
    },
    () => onError?.(),
  );
};

export const addGroupPermissions = (
  activeUser: NDKUser | undefined,
  openLoginModal: () => void,
  createNewEvent: () => NDKEvent,
  groupMetadata: GroupMetadata,
  onSuccess?: () => void,
  onError?: () => void,
) => {
  if (!activeUser?.pubkey) {
    console.log('activeUser false ', activeUser);
    openLoginModal();
    return;
  }
  const event = createNewEvent();
  event.kind = 9003;
  event.tags = [
    ['h', groupMetadata.id],
    ['p', activeUser.pubkey],
    ['permission', GroupAdminPermissionEnum.AddUser],
    ['permission', GroupAdminPermissionEnum.EditMetadata],
    ['permission', GroupAdminPermissionEnum.DeleteEvent],
    ['permission', GroupAdminPermissionEnum.RemoveUser],
    ['permission', GroupAdminPermissionEnum.AddPermission],
    ['permission', GroupAdminPermissionEnum.RemovePermission],
    ['permission', GroupAdminPermissionEnum.EditGroupStatus],
    //['permission', 'delete-group'], it is not supported on fiatjaf relay29
  ];
  event.publish().then((r) => {
    r.size > 0 ? onSuccess?.() : onError?.();
  });
};

export const updateGroupMetadata = (
  activeUser: NDKUser | undefined,
  openLoginModal: () => void,
  createNewEvent: () => NDKEvent,
  groupMetadata: GroupMetadata,
  onSuccess?: () => void,
  onError?: () => void,
) => {
  if (!activeUser) {
    openLoginModal();
    return;
  }

  const event = createNewEvent();
  event.kind = 9002;

  const tagsArray: [string, string][] = [
    ['h', groupMetadata.id],
    ['name', groupMetadata?.name],
    ['about', groupMetadata?.about],
    ['picture', groupMetadata?.picture],
  ];
  event.tags = tagsArray.filter(([, value]) => value !== undefined && value !== null);
  event.publish().then((r) => {
    r.size > 0 ? onSuccess?.() : onError?.();
  });
};

export const deleteGroup = (
  activeUser: NDKUser | undefined,
  openLoginModal: () => void,
  createNewEvent: () => NDKEvent,
  groupId: string,
  onSuccess?: () => void,
  onError?: () => void,
) => {
  if (!activeUser) {
    console.log('activeUser false ', activeUser);
    openLoginModal();
    return;
  }
  const event = createNewEvent();
  event.kind = 9008;
  event.tags = [['h', groupId]];
  event.publish().then(
    (r) => {
      r.size > 0 ? onSuccess?.() : onError?.();
    },
    () => onError?.(),
  );
};

export function generateGroupId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 3) + 8;
  const timestamp = Math.floor(Date.now() / 1000);
  let groupId = timestamp.toString(16).slice(0, 3);
  for (let i = 0; i < length - 3; i++) {
    groupId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return groupId;
}
