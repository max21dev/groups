import { useActiveUser, useNewEvent } from 'nostr-hooks';
import { z } from 'zod';

import { useActiveGroup, useGlobalNdk, useLoginModalState, useNip29Ndk } from '@/shared/hooks';
import { GroupAdminPermissionEnum, GroupMetadata } from '@/shared/types';
import { useToast } from '@/shared/components/ui/use-toast';
import { metadataFormSchema, useMetadataForm } from '@/shared/types/forms-types';

export const useGroupCreate = (
  setIsDialogOpen: (value: ((prevState: boolean) => boolean) | boolean) => void,
) => {
  const { globalNdk } = useGlobalNdk();
  const { nip29Ndk } = useNip29Ndk();
  const { openLoginModal } = useLoginModalState();

  const { activeUser } = useActiveUser({ customNdk: globalNdk });
  const { createNewEvent } = useNewEvent({ customNdk: nip29Ndk });
  const { setActiveGroupId } = useActiveGroup();

  const { toast } = useToast();

  function generateGroupId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * 3) + 8;
    const timestamp = Math.floor(Date.now() / 1000);
    let groupId = timestamp.toString(16).slice(0, 3);
    for (let i = 0; i < length - 3; i++) {
      groupId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return groupId;
  }

  const createGroup = (
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
    event.publish().then((r) => {
      r.size > 0 ? onSuccess?.() : onError?.();
    });
  };

  const addGroupPermissions = (
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
      //['permission', 'delete-group'], it is not supported on fiatjaf based relay
    ];
    event.publish().then((r) => {
      r.size > 0 ? onSuccess?.() : onError?.();
    });
  };

  const updateGroupMetadata = (
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

  const metadataForm = useMetadataForm(undefined);

  function onSubmit(values: z.infer<typeof metadataFormSchema>) {
    const groupData: GroupMetadata = {
      id: generateGroupId(),
      name: values?.name,
      picture: values?.picture,
      about: values?.about,
    } as GroupMetadata;

    createGroup(
      groupData,
      () =>
        addGroupPermissions(
          groupData,
          () =>
            updateGroupMetadata(
              groupData,
              () => {
                toast({ title: 'Success', description: 'Group metadata updated successfully' });
                setIsDialogOpen(false);
                setActiveGroupId(groupData.id);
              },
              () =>
                toast({
                  title: 'Error',
                  description: 'Failed to update group metadata',
                  variant: 'destructive',
                }),
            ),
          () =>
            toast({
              title: 'Error',
              description: 'Failed to update group permissions',
              variant: 'destructive',
            }),
        ),
      () =>
        toast({ title: 'Error', description: 'Failed to Create group', variant: 'destructive' }),
    );
  }

  return { metadataForm, onSubmit };
};
