import { useActiveGroup, useGroupMembers } from '@/shared/hooks';
import { DataTable } from '@/features/groups/group-details/group-details-edit/hooks/data-table.tsx';
import { membersColumns } from '@/features/groups/group-details/group-details-edit/hooks/membersColumns.tsx';
import { useGroupDetails } from '@/features/groups/group-details/hooks';

export const GroupDetailsEditMembers = () => {
  const { activeGroupId } = useActiveGroup();
  const { members } = useGroupMembers(activeGroupId);
  const { handleRemoveUserFromGroup } = useGroupDetails({ groupId: activeGroupId });

  const removeMember = (pubkey: string) => {
    handleRemoveUserFromGroup(pubkey);
  };
  const columns = membersColumns(removeMember);

  return <div>{members && <DataTable columns={columns} data={members} />}</div>;
};
