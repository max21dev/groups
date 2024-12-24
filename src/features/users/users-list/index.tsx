import { EllipsisIcon, MaximizeIcon } from 'lucide-react';
import { useProfile } from 'nostr-hooks';
import { Link } from 'react-router-dom';

import { UserAvatar } from '@/features/users';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useActiveGroup, useActiveRelay } from '@/shared/hooks';
import { ellipsis, formatTimestampToDate } from '@/shared/utils';

import { UsersListItem } from './components/users-list-item';

export const UsersList = ({
  tags,
  pubkey,
  createdAt,
  address,
}: {
  tags: string[][];
  pubkey: string;
  createdAt: number | undefined;
  address: string;
}) => {
  const { profile } = useProfile({ pubkey });
  const { activeRelay } = useActiveRelay();
  const { activeGroupId } = useActiveGroup();

  const title = tags.find((tag) => tag[0] === 'title');
  const description = tags.find((tag) => tag[0] === 'description');

  return (
    <div className="flex flex-col gap-1 p-2 rounded-md overflow-y-scroll max-h-80 [overflow-wrap: anywhere;]">
      <div className="flex items-center gap-2 mb-2">
        <UserAvatar pubkey={pubkey} />
        <div className="flex flex-col">
          <span>
            {profile?.name || profile?.displayName || profile?.nip05 || ellipsis(pubkey, 4)}
          </span>
          <span className="text-xs">{createdAt && formatTimestampToDate(createdAt)}</span>
        </div>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisIcon size={20} className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  to={`/relay/${activeRelay?.replace('wss://', '')}/group/${activeGroupId}/e/${address}`}
                  className="flex items-center gap-2 w-full"
                >
                  <MaximizeIcon size={18} />
                  Open
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <h4>{title?.[1]}</h4>
      <p className="mb-1">{description?.[1]}</p>
      {tags
        .filter((tag) => tag[0] === 'p')
        .map((tag, index) => (
          <UsersListItem key={index} pubkey={tag[1]} />
        ))}
    </div>
  );
};
