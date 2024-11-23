import { GroupAvatar } from '@/features/groups';

import { Badge } from '@/shared/components/ui/badge.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card.tsx';

import { useActiveGroup, useGroupMessages } from '@/shared/hooks';
import { Group } from '@/shared/types';

import { displayTime, ellipsis } from '@/shared/utils';

type GroupWidgetProps = {
  group: Group;
};

export const GroupWidget = ({ group }: GroupWidgetProps) => {
  const { setActiveGroupId } = useActiveGroup();

  const { messages } = useGroupMessages(group.id);
  const lastMessage = messages[0];

  return (
    <Card
      className="shadow-md justify-between hover:bg-gradient-to-r from-gray-400 to-green-100 cursor-pointer"
      onClick={() => setActiveGroupId(group.id)}
    >
      <CardHeader className="p-4 space-y-0 flex flex-row gap-2 items-center">
        <GroupAvatar groupId={group.id} />
        <CardTitle className="text-sm font-bold">{group.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div>
          <span className="font-medium">
            <Badge>NIP29 Group</Badge> <Badge>{group?.privacy}</Badge> <Badge>{group?.type}</Badge>
          </span>
        </div>
        {group?.about && (
          <div className="flex items-start text-sm mt-2 [overflow-wrap:anywhere]">
            <span>{ellipsis(group?.about, 60)}</span>
          </div>
        )}
        {lastMessage && (
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <div>{ellipsis(lastMessage.content, 20)}</div>
            <div>{displayTime(lastMessage.createdAt)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};