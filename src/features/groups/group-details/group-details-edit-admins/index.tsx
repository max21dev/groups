import { useActiveGroup, useGroupAdmins } from '@/shared/hooks';
import { DataTable } from '@/features/groups/group-details/group-details-edit/hooks/data-table.tsx';
import { useGroupDetails } from '@/features/groups/group-details/hooks';
import { adminsColumns } from '@/features/groups/group-details/group-details-edit/hooks/adminsColumns.tsx';

export const GroupDetailsEditAdmins = () => {
  const { activeGroupId } = useActiveGroup();
  const { admins } = useGroupAdmins(activeGroupId);
  const { handleRemoveUserFromGroup } = useGroupDetails({ groupId: activeGroupId });

  const removeAdmins = (pubkey: string) => {
    handleRemoveUserFromGroup(pubkey);
  };
  const columns = adminsColumns(removeAdmins);

  return <div>{admins && <DataTable columns={columns} data={admins} />}</div>;
};
