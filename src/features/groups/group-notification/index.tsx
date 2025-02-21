import { Switch } from '@/shared/components/ui/switch';

import { useGroupNotification } from './hooks';

export const GroupNotification = ({ groupId }: { groupId: string | undefined }) => {
  const { isNotificationEnabled, toggleNotification, activeUser } = useGroupNotification(groupId);

  if (!activeUser) return null;

  return (
    <div className="flex items-center gap-2">
      <span>Notifications</span>
      <Switch checked={isNotificationEnabled} onCheckedChange={toggleNotification} />
    </div>
  );
};
