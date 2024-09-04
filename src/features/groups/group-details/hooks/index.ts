import { useGroup, useGroupAdmin, useGroupAdmins, useGroupMembers } from '@/shared/hooks';
import { useActiveUser } from 'nostr-hooks';

export const useGroupDetails = ({ groupId }: { groupId: string }) => {
  const { group } = useGroup(groupId);
  const { members } = useGroupMembers(groupId);
  const { admins } = useGroupAdmins(groupId);
  const { activeUser } = useActiveUser();
  const { canEditMetadata } = useGroupAdmin(groupId, activeUser?.pubkey);

  return { group, members, admins, canEditMetadata };
};
