import { useActiveGroup } from '@/shared/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card.tsx';
import { Badge } from '@/shared/components/ui/badge.tsx';
import { useGroupsList } from '@/features/groups/hooks';

export const GroupsListWidget = () => {
  const { sortedGroups } = useGroupsList();
  const { setActiveGroupId } = useActiveGroup();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 m-4 overflow-x-auto">
      {sortedGroups &&
        sortedGroups.map((group) => (
          <Card
            key={group.id}
            className="shadow-md justify-between hover:bg-gradient-to-r from-gray-400 to-green-100 cursor-pointer"
            onClick={() => setActiveGroupId(group.id)}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-bold">{group.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div>
                <span className="font-medium">
                  <Badge>{group?.privacy}</Badge> <Badge>{group?.type}</Badge>
                </span>
              </div>
              {group?.about && (
                <div className="flex items-start text-sm mt-2">
                  <span>{group?.about}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
};
