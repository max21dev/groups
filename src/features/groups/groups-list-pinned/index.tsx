import { PinIcon } from 'lucide-react';

import { Link } from 'react-router-dom';

import { GroupAvatar } from '@/features/groups/group-avatar';
import { GroupBookmark } from '@/features/groups/group-bookmark';
import { useGroupBookmark } from '@/features/groups/group-bookmark/hooks';
import { useHomePage } from '@/pages/home/hooks';

import { useActiveGroup } from '@/shared/hooks';
import { cn } from '@/shared/utils';

export const GroupsListPinned = () => {
  const { bookmarkedGroups, activeUser } = useGroupBookmark('');

  const { isCollapsed, isMobile } = useHomePage();

  const { activeGroupId } = useActiveGroup();

  if (!bookmarkedGroups.length || activeUser === null) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 pb-2 border-b">
      <div
        className={cn('flex items-center gap-2 p-2', isCollapsed && !isMobile && 'justify-center')}
      >
        {(!isCollapsed || isMobile) && <p className="text-sm font-semibold">Pinned Groups</p>}
        <PinIcon size={17} className="rotate-45" />
      </div>
      {bookmarkedGroups.map((group) => (
        <Link
          key={group.id}
          className={cn(
            'flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent',
            group.id === activeGroupId && 'bg-accent',
            isCollapsed && !isMobile && 'justify-center',
          )}
          to={`/?relay=${group.relay}&groupId=${group.id}`}
        >
          <GroupAvatar relay={group.relay} groupId={group.id} />
          {(!isCollapsed || isMobile) && (
            <>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold truncate">{group.name}</p>
                <p className="text-xs truncate text-muted-foreground">
                  {group.relay.replace('wss://', '')}
                </p>
              </div>
              <div
                className="ms-auto rounded hover:bg-black/20 [&_*]:w-8 [&_*]:h-8 [&_*]:p-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <GroupBookmark groupId={group.id} groupName={group.name} />
              </div>
            </>
          )}
        </Link>
      ))}
    </div>
  );
};
