import { UserProfileForm } from '@/features/users';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Switch } from '@/shared/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

import { useUserSettings } from './hooks';

export const UserSettings = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { userSettings, updateUserSettings, activeUser } = useUserSettings();

  const handleToggle = (key: 'not_joined_groups' | 'admin_groups' | 'member_groups') => {
    updateUserSettings({ [key]: !userSettings?.[key] });
  };

  if (!activeUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden [&>button]:right-6 [&>button]:top-6">
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="Profile" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="Profile" className="flex-1">
              Profile
            </TabsTrigger>
            <TabsTrigger value="Notifications" className="flex-1">
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Profile" className="mt-4 overflow-y-auto max-h-[60vh]" tabIndex={-1}>
            <UserProfileForm />
          </TabsContent>

          <TabsContent value="Notifications" className="space-y-4 mt-4 text-sm" tabIndex={-1}>
            <div className="flex items-center justify-between">
              <span>Not Joined Groups</span>
              <Switch
                checked={userSettings?.not_joined_groups}
                onCheckedChange={() => handleToggle('not_joined_groups')}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Admin Groups</span>
              <Switch
                checked={userSettings?.admin_groups}
                onCheckedChange={() => handleToggle('admin_groups')}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Member Groups</span>
              <Switch
                checked={userSettings?.member_groups}
                onCheckedChange={() => handleToggle('member_groups')}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
