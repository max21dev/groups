import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { GroupAdminAvailablePermission, GroupAdminPermission, GroupMember } from '@/shared/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { Button } from '@/shared/components/ui/button';
import { Check, Copy, Edit, Trash } from 'lucide-react';
import { useGlobalProfile } from '@/shared/hooks';
import { ConfirmDialog } from '@/features/groups/group-details/confirm-dialog';
import { Checkbox } from '@/shared/components/ui/checkbox.tsx';

export const membersColumns: (
  removeMember: (pubkey: string) => void,
  addUserPermissions: (pubkey: string, newPermissions: GroupAdminPermission[] | []) => void,
) => ColumnDef<GroupMember>[] = (removeMember, addUserPermissions) => [
  {
    id: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => {
      const pubkey: string | undefined = row?.getValue('publicKey');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { profile } = useGlobalProfile({ pubkey });

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="flex justify-center items-center">
                {profile?.image ? (
                  <AvatarImage src={profile?.image} alt={profile?.name} />
                ) : (
                  <AvatarFallback>{pubkey?.slice(0, 2).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{profile?.name || pubkey}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
      const { profile } = useGlobalProfile({ pubkey });
      return profile?.name || '-';
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
        <TooltipProvider>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{shortenedPubkey}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{pubkey}</p>
              </TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </TooltipProvider>
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
      const [permissions, setPermissions] = useState<GroupAdminPermission[]>([]); // State for permissions

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
        removeMember(pubkey);
        setRemoveDialogOpen(false);
      };

      const handleAddPermissions = () => {
        addUserPermissions(pubkey, permissions);
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
            title="Add Permissions"
            confirmButtonLabel="Add Permissions"
            confirmButtonVariant="default"
            confirmAction={handleAddPermissions}
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
            <p>Are you sure you want to remove this member? This action cannot be undone.</p>
            <p>{String(row?.getValue('publicKey'))?.slice(0, 10) ?? '-'}...</p>
          </ConfirmDialog>
        </div>
      );
    },
  },
];
