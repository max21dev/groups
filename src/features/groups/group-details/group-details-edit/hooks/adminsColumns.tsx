import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  GroupAdmin,
  GroupAdminPermission,
  GroupRole,
} from '@/shared/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

import { Button } from '@/shared/components/ui/button.tsx';
import { Check, Copy, Edit, Trash } from 'lucide-react';
import { useGlobalProfile } from '@/shared/hooks';
import { ConfirmDialog } from '@/features/groups/group-details/confirm-dialog';
import { Checkbox } from '@/shared/components/ui/checkbox.tsx';

export const adminsColumns: (
  removeAdmins: (pubkey: string) => void,
  updateAdminRoles: (
    pubkey: string,
    oldPermissions: string[] | [],
    newPermissions: string[] | [],
  ) => void,
  GroupRoles: GroupRole[] | undefined,
) => ColumnDef<GroupAdmin>[] = (removeAdmins, updateAdminRoles, GroupRoles) => [
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
    id: 'roles',
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => {
      const permissions: GroupAdminPermission[] = row?.getValue('roles');
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
      const [roles, setRoles] = useState<string[]>(
        row?.getValue('roles') || [],
      ); // State for permissions

      // Handle checkbox change
      const handleCheckboxChange = (role: string) => {
        if (roles.includes(role)) {
          // If the permission is already included, remove it
          setRoles(roles.filter((p) => p !== role));
        } else {
          // Otherwise, add it
          setRoles([...roles, role]);
        }
      };

      const handleRemove = () => {
        removeAdmins(pubkey);
        setRemoveDialogOpen(false);
      };
      const handleUpdatePermissions = () => {
        updateAdminRoles(pubkey, row?.getValue('roles'), roles);
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
            <div>
              {GroupRoles && GroupRoles.map((role: GroupRole) => (
                <div className="m-2" key={role.name}>
                  <Checkbox
                    checked={roles.includes(role.name)}
                    onCheckedChange={() => handleCheckboxChange(role.name)} // Handle state change
                    id={role.name}
                  />
                  <span className="ml-2"> <span className="font-bold">{role.name}</span> - {role.description}</span>
                </div>
              ))}
            </div>
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
