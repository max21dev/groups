import { PinOffIcon } from 'lucide-react';

import { useGroupMetadata } from 'nostr-hooks/nip29';
import { Link } from 'react-router-dom';

import { GroupAvatar } from '@/features/groups/group-avatar';
import { useGroupBookmark } from '@/features/groups/group-bookmark/hooks';

import { useHomePage } from '@/pages/home/hooks';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { useActiveGroup } from '@/shared/hooks';
import { cn, ellipsis } from '@/shared/utils';

export const PinnedListItem = ({ relay, groupId }: { relay: string; groupId: string }) => {
  const { metadata } = useGroupMetadata(relay, groupId);
  const { removeGroupFromBookmarks } = useGroupBookmark(groupId, metadata?.name);
  const { activeGroupId } = useActiveGroup();
  const { isCollapsed, isMobile } = useHomePage();

  return (
    <Link
      className={cn(
        'flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent',
        groupId === activeGroupId && 'bg-accent',
        isCollapsed && !isMobile && 'justify-center',
      )}
      to={`/?relay=${relay}&groupId=${groupId}`}
    >
      <GroupAvatar relay={relay} groupId={groupId} />
      {(!isCollapsed || isMobile) && (
        <>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold truncate">
              {metadata?.name || ellipsis(groupId, 7)}
            </p>
            <p className="text-xs truncate text-muted-foreground">{relay.replace('wss://', '')}</p>
          </div>
          <div
            className="ms-auto rounded hover:bg-black/20"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PinOffIcon
                    size={25}
                    className="p-1"
                    onClick={() => removeGroupFromBookmarks()}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Unpin</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      )}
    </Link>
  );
};
