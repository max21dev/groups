import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { GroupMember } from '@/shared/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { Button } from '@/shared/components/ui/button';
import { Check, Copy, Trash } from 'lucide-react';
import { useGlobalProfile } from '@/shared/hooks';
import { ConfirmDialog } from '@/features/groups/group-details/confirm-dialog';

export const membersColumns: (
  removeMember: (pubkey: string) => void,
) => ColumnDef<GroupMember>[] = (removeMember) => [
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
      const [isDialogOpen, setDialogOpen] = useState(false);

      const handleRemove = () => {
        removeMember(pubkey);
        setDialogOpen(false);
      };

      return (
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
          <p>Are you sure you want to remove this member? This action cannot be undone.</p>
          <p>{String(row?.getValue('publicKey'))?.slice(0, 10) ?? '-'}...</p>
        </ConfirmDialog>
      );
    },
  },
];
