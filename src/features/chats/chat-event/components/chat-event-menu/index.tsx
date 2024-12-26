import { Copy, EllipsisIcon, MaximizeIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useActiveGroup, useActiveRelay, useCopyToClipboard } from '@/shared/hooks';

export const ChatEventMenu = ({ event }: { event: string }) => {
  const { activeRelay } = useActiveRelay();
  const { activeGroupId } = useActiveGroup();
  const { copyToClipboard } = useCopyToClipboard();
  const { event: eventParam } = useParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisIcon size={20} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!eventParam && (
          <DropdownMenuItem>
            <Link
              to={`/relay/${activeRelay?.replace('wss://', '')}/group/${activeGroupId}/e/${event}`}
              className="flex items-center gap-2 w-full"
            >
              <MaximizeIcon size={18} />
              Open
            </Link>
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
