import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { GroupAdmin, GroupAdminAvailablePermission, GroupAdminPermission } from '@/shared/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

import { Button } from '@/shared/components/ui/button.tsx';
import { Check, Copy, Edit, Trash } from 'lucide-react';
import { useGlobalProfile } from '@/shared/hooks';
import { ConfirmDialog } from '@/features/groups/group-details/confirm-dialog';
import { Checkbox } from '@/shared/components/ui/checkbox.tsx';

export const adminsColumns: (
  removeAdmins: (pubkey: string) => void,
  updateAdminPermissions: (
    pubkey: string,
    oldPermissions: GroupAdminPermission[] | [],
    newPermissions: GroupAdminPermission[] | [],
  ) => void,
) => ColumnDef<GroupAdmin>[] = (removeAdmins, updateAdminPermissions) => [
  {
    id: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => {
      const pubkey: string | undefined = row?.getValue('publicKey');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { profile } = useGlobalProfile({ pubkey: pubkey });
      return (
        <Avatar className="flex justify-center items-center">
          {!profile || !profile?.image ? (
            <AvatarFallback>{pubkey?.slice(0, 2).toUpperCase()}</AvatarFallback>
          ) : (
            <AvatarImage src={profile?.image} alt={profile?.name} />
          )}
        </Avatar>
      );
    },
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const pubkey: string = row?.getValue('publicKey');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { profile } = useGlobalProfile({ pubkey: pubkey });
      return profile?.name ? profile?.name : '-';
    },
  },
  {
    id: 'publicKey',
    accessorKey: 'publicKey',
    header: 'Public Key',
    cell: ({ row }) => {
      const pubkey: string = row?.getValue('publicKey');
      const shortenedPubkey = pubkey ? `${pubkey.slice(0, 10)}...${pubkey.slice(-10)}` : '';

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false);

      const handleCopy = () => {
        if (pubkey) {
          navigator.clipboard.writeText(pubkey);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      };

      return (
        <div className="flex items-center space-x-2">
          <span>{shortenedPubkey}</span>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      );
    },
  },
  {
    id: 'permissions',
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => {
      const permissions: GroupAdminPermission[] = row?.getValue('permissions');
      return (
        permissions && (
          <ul>
            {permissions.map((permission: GroupAdminPermission) => (
              <li key={permission}>{permission}</li>
            ))}
          </ul>
        )
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const pubkey: string = row?.getValue('publicKey');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isSetRolesDialogOpen, setSetRolesDialogOpen] = useState(false); // Separate state for Set Roles
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false); // Separate state for Remove Dialog
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [permissions, setPermissions] = useState<GroupAdminPermission[]>(
        row?.getValue('permissions') || [],
      ); // State for permissions

      // Handle checkbox change
      const handleCheckboxChange = (permission: GroupAdminPermission) => {
        if (permissions.includes(permission)) {
          // If the permission is already included, remove it
          setPermissions(permissions.filter((p) => p !== permission));
        } else {
          // Otherwise, add it
          setPermissions([...permissions, permission]);
        }
      };

      const handleRemove = () => {
        removeAdmins(pubkey);
        setRemoveDialogOpen(false);
      };
      const handleUpdatePermissions = () => {
        updateAdminPermissions(pubkey, row?.getValue('permissions'), permissions);
        setSetRolesDialogOpen(false);
      };
      return (
        <div>
          <ConfirmDialog
            triggerButton={
              <Button variant="default" className="mb-2">
                <Edit className="h-3 w-3 mr-2" />
                Set Roles
              </Button>
            }
            title="Change Permissions"
            confirmButtonLabel="Update"
            confirmButtonVariant="default"
            confirmAction={handleUpdatePermissions}
            open={isSetRolesDialogOpen}
            onOpenChange={setSetRolesDialogOpen}
          >
            <p>Change Permission for this user</p>
            <p>{String(row?.getValue('publicKey'))?.slice(0, 10) ?? '-'}...</p>
            <p>
              {GroupAdminAvailablePermission.map((permission: GroupAdminPermission) => (
                <div className="m-2" key={permission}>
                  <Checkbox
                    checked={permissions.includes(permission)}
                    onCheckedChange={() => handleCheckboxChange(permission)} // Handle state change
                    id={permission}
                  />
                  <span className="ml-2"> {permission}</span>
                </div>
              ))}
            </p>
          </ConfirmDialog>

          <ConfirmDialog
            triggerButton={
              <Button variant="destructive">
                <Trash className="h-3 w-3 mr-2" />
                Remove
              </Button>
            }
            title="Confirm Removal"
            confirmButtonLabel="Remove"
            confirmButtonVariant="destructive"
            confirmAction={handleRemove}
            open={isRemoveDialogOpen}
            onOpenChange={setRemoveDialogOpen}
          >
            <p>Are you sure you want to remove this admin? This action cannot be undone.</p>
            <p>{String(row?.getValue('publicKey'))?.slice(0, 10) ?? '-'}...</p>
          </ConfirmDialog>
        </div>
      );
    },
  },
];
