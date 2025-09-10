import { Copy, EllipsisIcon, MaximizeIcon, Trash2 } from 'lucide-react';
import { useActiveUser } from 'nostr-hooks';
import { useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { CompatibleApps } from '@/features/chats/chat-event/components/';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { useCopyToClipboard } from '@/shared/hooks';

export const ChatEventMenu = ({
  event,
  pubkey,
  deleteThreadComment,
  eventKind,
}: {
  event: string;
  deleteThreadComment?: (commentId: string) => void;
  pubkey?: string;
  eventKind?: number;
}) => {
  const { activeUser } = useActiveUser();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const eventId = searchParams.get('eventId');

  const eventUrl = useMemo(() => {
    const newSearchParams = new URLSearchParams(location.search);

    newSearchParams.set('eventId', event);

    return `${location.pathname}?${newSearchParams.toString()}`;
  }, [location.search, location.pathname, event]);

  const { copyToClipboard } = useCopyToClipboard();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisIcon size={20} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!eventId && (
          <DropdownMenuItem>
            <Link to={eventUrl} className="flex items-center gap-2 w-full">
              <MaximizeIcon size={18} />
              Open
            </Link>
          </DropdownMenuItem>
        )}

        {eventKind && <CompatibleApps eventId={event} eventKind={eventKind} />}

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
