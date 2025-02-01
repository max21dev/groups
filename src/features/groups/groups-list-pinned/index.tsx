import { PinIcon } from 'lucide-react';

import { useGroupBookmark } from '@/features/groups/group-bookmark/hooks';

import { useHomePage } from '@/pages/home/hooks';

import { cn } from '@/shared/utils';

import { PinnedListItem } from './components';

export const GroupsListPinned = () => {
  const { bookmarkedGroups, activeUser } = useGroupBookmark('');

  const { isCollapsed, isMobile } = useHomePage();

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
        <PinnedListItem key={group.id} relay={group.relay} groupId={group.id} />
      ))}
    </div>
  );
};
