import { GroupAvatar } from '@/features/groups';

import { Button } from '@/shared/components/ui/button.tsx';

import { cn, ellipsis, displayTime } from '@/shared/utils';

import { useGroupsListItem } from './hooks';

export const GroupsListItem = ({ groupId }: { groupId: string | undefined }) => {
  const {
    group,
    isCollapsed,
    messages,
    setActiveGroupId,
    activeGroupId,
    showGroup,
  } = useGroupsListItem({
    groupId,
  });

  if (!group || !showGroup) return null;

  return (
    <Button
      variant="ghost"
      size="lg"
      className={cn(
        'gap-4 items-center px-2 py-8 cursor-pointer overflow-hidden',
        isCollapsed ? 'justify-center' : 'justify-start',
        activeGroupId === groupId && 'bg-accent',
      )}
      onClick={() => setActiveGroupId(groupId)}
    >
      <GroupAvatar groupId={groupId} />

      {!isCollapsed && (
        <div className="flex flex-col items-start w-full">
          <div className="flex w-full justify-between">
            <span>{group.name}</span>

            {messages.length > 0 && (
              <span className="ml-1 text-gray-300 text-xs">
                {displayTime(messages[0].createdAt)}
              </span>
            )}
          </div>

          <span className="text-gray-400 truncate">{ellipsis(group.about, 20)} </span>

          {messages.length > 0 && (
            <span className="text-xs text-gray-300 truncate">
              {ellipsis(messages[0].content, 20)}
            </span>
          )}
        </div>
      )}
    </Button>
  );
};
