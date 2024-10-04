import { ColumnDef } from '@tanstack/react-table';
import { GroupMember } from '@/shared/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip.tsx';
import { useGlobalProfile } from '@/shared/hooks';
import { Button } from '@/shared/components/ui/button.tsx';
import { Trash } from 'lucide-react';

export const membersColumns: ColumnDef<GroupMember>[] = [
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
              <p>{profile?.name ? profile?.name : pubkey}</p>
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
  },
  {
    id: 'actions',
    header: 'Actions',
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <div>
          <Button disabled={true} variant="destructive">
            <Trash className="h-3 w-3 mr-2" />
            Remove
          </Button>
        </div>
      );
    },
  },
];
