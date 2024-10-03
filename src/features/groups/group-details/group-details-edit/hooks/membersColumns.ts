import { ColumnDef } from '@tanstack/react-table';
import { GroupMember } from '@/shared/types';

export const membersColumns: ColumnDef<GroupMember>[] = [

  {
    id: 'avatar',
    header: 'avatar',
    //   cell: ({ row }):Element => {
    //     const { profile } = useGlobalProfile(row.getValue('publicKey'));
    //     return  (
    //       <TooltipProvider>
    //         <Tooltip>
    //           <TooltipTrigger asChild>
    //       <Avatar className="flex justify-center items-center">
    //         {!profile || !profile?.image ? (
    //       <AvatarFallback>{pubkey.slice(0, 2).toUpperCase()}</AvatarFallback>
    //     ) : (
    //       <AvatarImage src={profile?.image} alt={profile?.name} />
    //   )}
    //     </Avatar>
    //     </TooltipTrigger>
    //     <TooltipContent>
    //     <p>{profile?.name ? profile?.name : pubkey}</p>
    //     </TooltipContent>
    //     </Tooltip>
    //     </TooltipProvider>
    //     )
    //
    //   },
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
];
