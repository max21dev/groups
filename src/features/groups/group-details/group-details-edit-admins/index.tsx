import { useActiveGroup, useGroupAdmins } from '@/shared/hooks';
import { DataTable } from '@/features/groups/group-details/group-details-edit/hooks/data-table.tsx';
import { useGroupDetails } from '@/features/groups/group-details/hooks';
import { adminsColumns } from '@/features/groups/group-details/group-details-edit/hooks/adminsColumns.tsx';
import { GroupAdminPermission } from '@/shared/types';

export const GroupDetailsEditAdmins = () => {
  const { activeGroupId } = useActiveGroup();
  const { admins } = useGroupAdmins(activeGroupId);
  const { handleRemoveUserFromGroup, handleAddAdminPermissions, handleRemoveAdminPermissions } =
    useGroupDetails({
      groupId: activeGroupId,
    });

  const removeAdmins = (pubkey: string) => {
    handleRemoveUserFromGroup(pubkey);
  };

  const updateAdminPermissions = (
    pubkey: string,
    oldPermissions: GroupAdminPermission[] | [],
    newPermissions: GroupAdminPermission[] | [],
  ) => {
    const permissionsToAdd = newPermissions.filter((permission) => {
      // @ts-ignore
      return !oldPermissions.includes(permission);
    });
    const permissionsToRemove = oldPermissions.filter((permission) => {
      // @ts-ignore
      return !newPermissions.includes(permission);
    });
    if (permissionsToAdd.length > 0) {
      handleAddAdminPermissions(pubkey, permissionsToAdd);
    }
    if (permissionsToRemove.length > 0) {
      handleRemoveAdminPermissions(pubkey, permissionsToRemove);
    }
  };

  const columns = adminsColumns(removeAdmins, updateAdminPermissions);

  return <div>{admins && <DataTable columns={columns} data={admins} />}</div>;
};
