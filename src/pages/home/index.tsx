import { ChatBottomBar, ChatList, ChatTopBar } from '@/features/chats';
import { GroupsFilterDropdown, GroupsList } from '@/features/groups';
import { RelayGroupsCount, RelaySelectDropdown } from '@/features/relays';
import { ActiveUserInfo, UserLoginModal } from '@/features/users';

import { ModeToggle } from '@/shared/components/mode-toggle';
import { Sidebar } from '@/shared/components/sidebar';
import { ZapModal } from '@/shared/components/zap-modal';

import { cn } from '@/shared/utils';

import { useHomePage } from './hooks';

export function HomePage() {
  const { isCollapsed, activeGroupId, activeUser } = useHomePage();

  return (
    <>
      <div className="flex w-full h-full">
        <Sidebar>
          <div className="flex flex-col w-full h-full">
            <div className="p-2">
              <div className={cn('flex gap-1 w-full', isCollapsed && 'flex-col')}>
                <ModeToggle />

                {activeUser?.pubkey && <GroupsFilterDropdown />}

                <RelaySelectDropdown />
              </div>
            </div>

            <div className="p-2">{!isCollapsed && <RelayGroupsCount />}</div>

            <div
              className={cn(
                'p-2 flex flex-col h-full gap-4 overflow-y-hidden hover:overflow-y-auto',
                isCollapsed && 'justify-center',
              )}
            >
              <GroupsList />
            </div>

            <div className="mt-auto w-full">
              <ActiveUserInfo />
            </div>
          </div>
        </Sidebar>

        <div className="w-full">
          <div className="flex flex-col w-full h-full">
            {!activeGroupId ? (
              <div className="flex flex-col justify-center items-center h-full">
                <h2>💬 Groups</h2>
              </div>
            ) : (
              <>
                <ChatTopBar />
                <ChatList />

                <div className="flex flex-col w-full items-center gap-2 p-2">
                  <ChatBottomBar />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <UserLoginModal />
      <ZapModal />
    </>
  );
}
