import { Button } from '@/shared/components/ui/button';

import { GroupAvatar } from '@/features/groups';

import { cn, displayTime, ellipsis } from '@/shared/utils';

import { useGroupsListItem } from './hooks';

export const GroupsListItem = ({
  groupId,
  setLastChatTimestampPerGroup,
}: {
  groupId: string;
  setLastChatTimestampPerGroup: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) => {
  const { metadata, isCollapsed, chats, setActiveGroupId, activeGroupId, showGroup, activeRelay } =
    useGroupsListItem({ groupId, setLastChatTimestampPerGroup });

  if (!metadata || !showGroup) return null;

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
      <GroupAvatar relay={activeRelay} groupId={groupId} />

      {!isCollapsed && (
        <div className="flex flex-col items-start w-full min-w-0">
          <div className="w-full flex items-center">
            <div className="truncate">{metadata?.name}</div>

            {chats && chats.length > 0 && (
              <div className="ml-auto shrink-0 text-gray-300 text-xs">
                {displayTime(chats[0].timestamp)}
              </div>
            )}
          </div>

          <span className="text-gray-400 truncate">
            {metadata && ellipsis(metadata.about, 20)}{' '}
          </span>

          {chats && chats.length > 0 && (
            <span className="text-xs text-gray-300 truncate">{ellipsis(chats[0].content, 20)}</span>
          )}
        </div>
      )}
    </Button>
  );
};
