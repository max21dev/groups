import { useActiveGroup, useGroupAdmins, useGroupRoles } from '@/shared/hooks';
import { DataTable } from '@/features/groups/group-details/group-details-edit/hooks/data-table.tsx';
import { useGroupDetails } from '@/features/groups/group-details/hooks';
import { adminsColumns } from '@/features/groups/group-details/group-details-edit/hooks/adminsColumns.tsx';

export const GroupDetailsEditAdmins = () => {
  const { activeGroupId } = useActiveGroup();
  const { admins } = useGroupAdmins(activeGroupId);
  const { roles } = useGroupRoles(activeGroupId);
  const { handleRemoveUserFromGroup, handleUpdateAdminRoles } =
    useGroupDetails({
      groupId: activeGroupId,
    });

  const removeAdmins = (pubkey: string) => {
    handleRemoveUserFromGroup(pubkey);
  };

  const updateAdminRoles = (
    pubkey: string,
    oldPermissions: string[] | [],
    newPermissions: string[] | [],
  ) => {
    const permissionsToAdd = newPermissions.filter((permission) => {
      // @ts-ignore
      return !oldPermissions.includes(permission);
    });
    const permissionsToRemove = oldPermissions.filter((permission) => {
      // @ts-ignore
      return !newPermissions.includes(permission);
    });
    if (permissionsToAdd.length > 0 || permissionsToRemove.length > 0) {
      //With new changes of kin 9000, all permissions(old and new ones) should be send.
      handleUpdateAdminRoles(pubkey, newPermissions);
    }
  };

  const columns = adminsColumns(removeAdmins, updateAdminRoles, roles);

  return <div>{admins && <DataTable columns={columns} data={admins} />}</div>;
};
