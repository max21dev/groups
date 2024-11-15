import { useActiveGroup, useGroupMembers } from '@/shared/hooks';
import { DataTable } from '@/features/groups/group-details/group-details-edit/hooks/data-table.tsx';
import { membersColumns } from '@/features/groups/group-details/group-details-edit/hooks/membersColumns.tsx';
import { useGroupDetails } from '@/features/groups/group-details/hooks';
import { GroupAdminPermission } from '@/shared/types';

export const GroupDetailsEditMembers = () => {
  const { activeGroupId } = useActiveGroup();
  const { members } = useGroupMembers(activeGroupId);
  const { handleRemoveUserFromGroup, handleUpdateAdminRoles } = useGroupDetails({
    groupId: activeGroupId,
  });

  const removeMember = (pubkey: string) => {
    handleRemoveUserFromGroup(pubkey);
  };

  const addUserPermissions = (pubkey: string, newPermissions: GroupAdminPermission[] | []) => {
    if (newPermissions.length > 0) {
      handleUpdateAdminRoles(pubkey, newPermissions);
    }
  };

  const columns = membersColumns(removeMember, addUserPermissions);

  return <div>{members && <DataTable columns={columns} data={members} />}</div>;
};
