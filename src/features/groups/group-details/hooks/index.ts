import {
  useGroup,
  useGroupAdmin,
  useGroupAdmins,
  useGroupMembers,
  useLoginModalState,
} from '@/shared/hooks';

import { useActiveUser, useNewEvent } from 'nostr-hooks';
import { GroupMetadata } from '@/shared/types';

export const useGroupDetails = ({ groupId }: { groupId: string | undefined }) => {
  const { group } = useGroup(groupId);
  const { members } = useGroupMembers(groupId);
  const { admins } = useGroupAdmins(groupId);
  const { activeUser } = useActiveUser();
  const { canEditMetadata } = useGroupAdmin(groupId, activeUser?.pubkey);
  const { openLoginModal } = useLoginModalState();
  const { createNewEvent } = useNewEvent();

  function updateGroupMetadata(groupMetadata: GroupMetadata) {
    if (!activeUser) {
      openLoginModal();
      return;
    }

    const event = createNewEvent();
    event.kind = 9002;
    event.tags = [
      ['h', groupMetadata.id],
      ['name', groupMetadata?.name],
      ['about', groupMetadata?.about],
      ['picture', groupMetadata?.picture],
    ];
    event.publish();
  }

  return { group, members, admins, canEditMetadata, updateGroupMetadata };
};
