import { useActiveGroup, useGroupAdmins } from '@/shared/hooks';
import { DataTable } from '@/features/groups/group-details/group-details-edit/hooks/data-table.tsx';
import { useGroupDetails } from '@/features/groups/group-details/hooks';
import { adminsColumns } from '@/features/groups/group-details/group-details-edit/hooks/adminsColumns.tsx';
import { GroupAdminPermission } from '@/shared/types';

export const GroupDetailsEditAdmins = () => {
  const { activeGroupId } = useActiveGroup();
  const { admins } = useGroupAdmins(activeGroupId);
  const { handleRemoveUserFromGroup } = useGroupDetails({
    groupId: activeGroupId,
  });

  const removeAdmins = (pubkey: string) => {
    handleRemoveUserFromGroup(pubkey);
  };

  const updateAdminPermissions = (
    pubkey: string,
    addPermissions: GroupAdminPermission[] | [],
    removePermissions: GroupAdminPermission[] | [],
  ) => {
    ///TODO: Implement this function , it should be done in two events, one for adding permissions and one for removing permissions (kinds: 9003,9004)
    console.log(pubkey, addPermissions, removePermissions);
  };

  const columns = adminsColumns(removeAdmins, updateAdminPermissions);

  return <div>{admins && <DataTable columns={columns} data={admins} />}</div>;
};
