import { PinIcon, PinOffIcon } from 'lucide-react';

import { useGroupBookmark } from '@/features/groups/group-bookmark/hooks';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/components/ui/context-menu';

export const GroupsListMenu = ({
  groupId,
  children,
}: {
  groupId: string | undefined;
  children: React.ReactNode;
}) => {
  const { activeUser, isBookmarked, addGroupToBookmarks, removeGroupFromBookmarks } =
    useGroupBookmark(groupId);

  if (!activeUser) return children;

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={isBookmarked ? () => removeGroupFromBookmarks() : () => addGroupToBookmarks()}
          className="hover:cursor-pointer"
        >
          {isBookmarked ? (
            <div className="flex items-center gap-3">
              <PinOffIcon size={16} />
              Unpin
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <PinIcon size={16} />
              Pin
            </div>
          )}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
