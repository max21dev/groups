import { GroupAvatar } from '@/features/groups';
import { UserAvatar } from '@/features/users';

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
      <CardContent className="p-4 pt-0 h-2/3 flex flex-col justify-between">
        <div>
          <div>
            <span className="font-medium">
              <Badge>NIP29 Group</Badge> <Badge>{group?.privacy}</Badge>{' '}
              <Badge>{group?.type}</Badge>
            </span>
          </div>
          {group?.about && (
            <div className="flex items-start text-sm mt-2 [overflow-wrap:anywhere]">
              <span>{ellipsis(group?.about, 40)}</span>
            </div>
          )}
        </div>
        {lastMessage && (
          <div className="flex items-center text-xs mt-2 mb-1 text-gray-500">
            <div className="w-4 h-4 mr-1 [&_*]:h-full [&_*]:w-full">
              <UserAvatar pubkey={lastMessage.authorPublicKey} />
            </div>
            <div>{ellipsis(lastMessage.content, 15)}</div>
            <div className="ml-auto">{displayTime(lastMessage.createdAt)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};