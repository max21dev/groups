import { useActiveUser, useNewEvent } from 'nostr-hooks';
import { z } from 'zod';

import { useActiveGroup, useGlobalNdk, useLoginModalState, useNip29Ndk } from '@/shared/hooks';
import { GroupMetadata } from '@/shared/types';
import { useToast } from '@/shared/components/ui/use-toast';
import { metadataFormSchema, useMetadataForm } from '@/shared/types/forms-types';
import { addGroupPermissions, createGroup, generateGroupId, updateGroupMetadata } from '@/features/groups/shared/hooks';

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


  const metadataForm = useMetadataForm(undefined);

  function onSubmit(values: z.infer<typeof metadataFormSchema>) {
    const groupData: GroupMetadata = {
      id: generateGroupId(),
      name: values?.name,
      picture: values?.picture,
      about: values?.about,
    } as GroupMetadata;

    createGroup(
      activeUser,
      openLoginModal,
      createNewEvent,
      groupData,
      () =>
        addGroupPermissions(
          activeUser,
          openLoginModal,
          createNewEvent,
          groupData,
          () =>
            updateGroupMetadata(
              activeUser,
              openLoginModal,
              createNewEvent,
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
        toast({ title: 'Error', description: 'Failed to create the group. Please ensure that your selected relay supports group creation!', variant: 'destructive' }),
    );
  }

  return { metadataForm, onSubmit };
};
