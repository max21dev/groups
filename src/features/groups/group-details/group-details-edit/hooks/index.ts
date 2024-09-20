import { useActiveUser, useNewEvent } from 'nostr-hooks';
import { z } from 'zod';

import { useGlobalNdk, useLoginModalState, useNip29Ndk } from '@/shared/hooks';
import { Group, GroupMetadata, GroupStatus } from '@/shared/types';
import { useToast } from '@/shared/components/ui/use-toast';
import {
  groupStatusSchema,
  metadataFormSchema,
  useGroupStatusForm,
  useMetadataForm,
} from '@/shared/types/forms-types';
import { updateGroupMetadata, updateGroupStatus } from '@/features/groups/shared/hooks';

export const useGroupDetailsEdit = ({
  group,
  setEditMode,
}: {
  group: Group | undefined;
  setEditMode: (value: boolean) => void;
}) => {
  const { globalNdk } = useGlobalNdk();
  const { nip29Ndk } = useNip29Ndk();
  const { openLoginModal } = useLoginModalState();

  const { activeUser } = useActiveUser({ customNdk: globalNdk });
  const { createNewEvent } = useNewEvent({ customNdk: nip29Ndk });

  const { toast } = useToast();

  const metadataForm = useMetadataForm(group);
  const groupStatusForm = useGroupStatusForm(group);

  function onSubmitMetadata(values: z.infer<typeof metadataFormSchema>) {
    const updatedGroup: GroupMetadata = {
      id: group?.id,
      name: values.name,
      picture: values.picture,
      about: values.about,
    } as GroupMetadata;

    updateGroupMetadata(
      activeUser,
      openLoginModal,
      createNewEvent,
      updatedGroup,
      () => toast({ title: 'Success', description: 'Group updated successfully' }),
      () =>
        toast({ title: 'Error', description: 'Failed to update group', variant: 'destructive' }),
    );

    setEditMode(false);
  }

  function onSubmitGroupStatus(values: z.infer<typeof groupStatusSchema>) {
    const groupStatus: GroupStatus = {
      id: group?.id,
      privacy: values.privacy,
      type: values.type,
    } as GroupStatus;

    updateGroupStatus(
      activeUser,
      openLoginModal,
      createNewEvent,
      groupStatus,
      () => toast({ title: 'Success', description: 'Group updated successfully' }),
      () =>
        toast({ title: 'Error', description: 'Failed to update group', variant: 'destructive' }),
    );

    setEditMode(false);
  }

  return { metadataForm, groupStatusForm, onSubmitMetadata, onSubmitGroupStatus };
};
