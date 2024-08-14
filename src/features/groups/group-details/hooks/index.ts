import { useGroup, useGroupAdmins, useGroupMembers } from '@/shared/hooks';

export const useGroupDetails = ({ groupId }: { groupId: string }) => {
  const { group } = useGroup(groupId);
  const { members } = useGroupMembers(groupId);
  const { admins } = useGroupAdmins(groupId);

  return { group, members, admins };
};
