import { useActiveGroup, useGroupMembers } from '@/shared/hooks';
import { DataTable } from '@/features/groups/group-details/group-details-edit/hooks/data-table.tsx';
import { membersColumns } from '@/features/groups/group-details/group-details-edit/hooks/membersColumns.tsx';

export const GroupDetailsEditMembers = () => {
  const { activeGroupId } = useActiveGroup();
  const { members } = useGroupMembers(activeGroupId);
  return (
    <div>
      {members && <DataTable columns={membersColumns} data={members} />}
    </div>
  );
}