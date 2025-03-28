import { Copy, EllipsisIcon, MaximizeIcon, Trash2 } from 'lucide-react';
import { useActiveUser } from 'nostr-hooks';
import { Link, useSearchParams } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { useActiveGroup, useActiveRelay, useCopyToClipboard } from '@/shared/hooks';

export const ChatEventMenu = ({
  event,
  pubkey,
  deleteThreadComment,
}: {
  event: string;
  deleteThreadComment?: (commentId: string) => void;
  pubkey?: string;
}) => {
  const { activeRelay } = useActiveRelay();
  const { activeGroupId } = useActiveGroup();
  const { activeUser } = useActiveUser();
  const [searchParams] = useSearchParams();

  const eventId = searchParams.get('eventId');

  const { copyToClipboard } = useCopyToClipboard();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisIcon size={20} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!eventId && (
          <DropdownMenuItem>
            <Link
              to={`/?relay=${activeRelay}&groupId=${activeGroupId}&eventId=${event}`}
              className="flex items-center gap-2 w-full"
            >
              <MaximizeIcon size={18} />
              Open
            </Link>
          </DropdownMenuItem>
        )}
        {deleteThreadComment && activeUser?.pubkey === pubkey && (
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-600"
            onClick={() => deleteThreadComment(event)}
          >
            <Trash2 size={18} />
            Delete
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => copyToClipboard(event)}
        >
          <Copy size={18} />
          Copy Event ID
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
