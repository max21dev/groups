import { Copy, EllipsisIcon, MaximizeIcon, Trash2 } from 'lucide-react';
import { useActiveUser } from 'nostr-hooks';
import { Link, useParams } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { useActiveGroup, useActiveRelay, useCopyToClipboard } from '@/shared/hooks';

export const ChatEventMenu = ({
  event,
  isChatThread,
  pubkey,
  deleteThreadComment,
}: {
  event: string;
  isChatThread?: boolean;
  deleteThreadComment?: (commentId: string) => void;
  pubkey?: string;
}) => {
  const { activeRelay } = useActiveRelay();
  const { activeGroupId } = useActiveGroup();
  const { activeUser } = useActiveUser();

  const { event: eventParam } = useParams();

  const { copyToClipboard } = useCopyToClipboard();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisIcon size={20} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!eventParam && (
          <DropdownMenuItem>
            <Link
              to={`/?relay=${activeRelay}&groupId=${activeGroupId}&eventId=${event}${isChatThread ? '&chatThread=true' : ''}`}
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
