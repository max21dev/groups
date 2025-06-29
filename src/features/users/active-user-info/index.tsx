import { EllipsisVerticalIcon } from 'lucide-react';

import { useState } from 'react';

import { UserAvatar, UserSettings } from '@/features/users';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { cn } from '@/shared/utils';

import { useActiveUserInfo } from './hooks';

export function ActiveUserInfo() {
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);

  const {
    activeGroupId,
    activeUser,
    isCollapsed,
    openLoginModal,
    profile,
    isMobile,
    logout,
    navigate,
  } = useActiveUserInfo();

  return (
    <>
      {activeUser ? (
        <div
          className={cn(
            'p-2 flex justify-center items-center border-t',
            (!isCollapsed || isMobile) && 'bg-accent',
          )}
        >
          <UserAvatar pubkey={activeUser?.pubkey} />

          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col ml-2 truncate">
              <span className="text-sm h-4">
                {profile?.displayName ? profile?.displayName : profile?.name}
              </span>
              <span className="text-sm text-gray-500 truncate">
                {activeUser?.profile?.nip05 || activeUser?.npub}
              </span>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVerticalIcon size={20} className="cursor-pointer w-8" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-0 [&_*]:p-0">
              <DropdownMenuItem>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/wallets')}>
                  Wallets
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setIsUserSettingsOpen(true)}
                >
                  Settings
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant="ghost" className="w-full" onClick={() => logout()}>
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isUserSettingsOpen && (
            <UserSettings
              isOpen={isUserSettingsOpen}
              onClose={() => setIsUserSettingsOpen(false)}
            />
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
