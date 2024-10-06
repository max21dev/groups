import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { GroupAdmin, GroupAdminPermission } from '@/shared/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { Check, Copy, Trash } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { useGlobalProfile } from '@/shared/hooks'; // Assuming you have a dialog component

export const adminsColumns: (removeAdmins: (pubkey: string) => void) => ColumnDef<GroupAdmin>[] = (
  removeAdmins,
) => [
  {
    id: 'avatar',
    header: 'avatar',
    cell: ({ row }) => {
      const pubkey: string | undefined = row?.getValue('publicKey');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { profile } = useGlobalProfile({ pubkey: pubkey });
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="flex justify-center items-center">
                {!profile || !profile?.image ? (
                  <AvatarFallback>{pubkey?.slice(0, 2).toUpperCase()}</AvatarFallback>
                ) : (
                  <AvatarImage src={profile?.image} alt={profile?.name} />
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
    id: 'permissions',
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => {
      console.log('permissions', row?.getValue('permissions'));
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
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-3 w-3 mr-2" />
                Remove
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogTitle>Confirm Removal</DialogTitle>
              <DialogDescription>
                <p>Are you sure you want to remove this admin? This action cannot be undone.</p>
                <p>{row?.getValue('publicKey')}</p>
              </DialogDescription>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleRemove}>
                  Remove
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
