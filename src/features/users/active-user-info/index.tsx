import { UserAvatar } from '@/features/users';

import { Button } from '@/shared/components/ui/button';

import { cn } from '@/shared/utils';

import { useActiveUserInfo } from './hooks';

export function ActiveUserInfo() {
  const { activeGroupId, activeUser, isCollapsed, openLoginModal, profile } = useActiveUserInfo();

  return (
    <>
      {activeUser ? (
        <div className={cn('p-2 flex justify-center border-t', !isCollapsed && 'bg-accent')}>
          <UserAvatar pubkey={activeUser?.pubkey} />

          {!isCollapsed && (
            <div className="flex flex-col ml-2 truncate">
              <span className="text-sm h-4">
                {profile?.displayName ? profile?.displayName : profile?.name}
              </span>
              <span className="text-sm text-gray-500 truncate">
                {activeUser?.profile?.nip05 || activeUser?.npub}
              </span>
            </div>
          )}
        </div>
      ) : !activeGroupId ? (
        <div className="p-2 w-full border-t">
          <Button variant="outline" className="w-full" onClick={() => openLoginModal()}>
            Login
          </Button>
        </div>
      ) : null}
    </>
  );
}
