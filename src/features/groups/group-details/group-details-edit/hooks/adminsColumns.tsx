import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { GroupAdmin, GroupAdminPermission } from '@/shared/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

import { Button } from '@/shared/components/ui/button.tsx';
import { Check, Copy, Edit, Trash } from 'lucide-react';
import { useGlobalProfile } from '@/shared/hooks';
import { ConfirmDialog } from '@/features/groups/group-details/confirm-dialog';

export const adminsColumns: (removeAdmins: (pubkey: string) => void) => ColumnDef<GroupAdmin>[] = (
  removeAdmins,
) => [
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
      const [isDialogOpen, setDialogOpen] = useState(false);

      const handleRemove = () => {
        removeAdmins(pubkey);
        setDialogOpen(false);
      };

      return (
        <div>
          {/* Set Roles Dialog */}
          <ConfirmDialog
            triggerButton={
              <Button disabled={true} variant="default" className="mb-2">
                <Edit className="h-3 w-3 mr-2" />
                Set Roles
              </Button>
            }
            title="Change Permissions"
            confirmButtonLabel="Update"
            confirmButtonVariant="default"
            confirmAction={() => console.log('Permission updated')} // Replace with actual logic
            open={isDialogOpen}
            onOpenChange={setDialogOpen}
          >
            <p>Change Permission for this user</p>
            <p>{row?.getValue('publicKey')}</p>
            <ul>
              <li>Permission 1</li>
              <li>Permission 2</li>
              {/* Add more permissions or other dynamic content */}
            </ul>
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
            open={isDialogOpen}
            onOpenChange={setDialogOpen}
          >
            <p>Are you sure you want to remove this admin? This action cannot be undone.</p>
            <p>{row?.getValue('publicKey')}</p>
          </ConfirmDialog>
        </div>
      );
    },
  },
];
