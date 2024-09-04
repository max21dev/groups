import { ChatBottomBar, ChatList, ChatTopBar } from '@/features/chats';
import { GroupsList } from '@/features/groups';
import { RelayGroupsCount, RelaySelectDropdown } from '@/features/relays';
import { ActiveUserInfo } from '@/features/users';

import { Sidebar } from '@/shared/components/sidebar';

import { cn } from '@/shared/utils/cn';

import { useHomePage } from './hooks';
import { ModeToggle } from '@/shared/components/mode-toggle';
import { GroupsFilterDropdown } from '@/features/groups/groups-list/groups-filter-dropdown';

export function HomePage() {
  const { isCollapsed, activeGroupId, activeUser } = useHomePage();

  return (
    <>
      <div className="flex w-full h-full">
        <Sidebar>
          <div className="flex flex-col h-full p-2 dark:bg-gray-950">
            <div className="flex flex-col h-full gap-4 overflow-y-hidden hover:overflow-y-auto">
              <div className="flex gap-1">
                {!isCollapsed && <ModeToggle />}
                <RelaySelectDropdown />
              </div>
              {activeUser?.pubkey && (
                <div className="flex gap-1">
                  <GroupsFilterDropdown />
                </div>
              )}

              {!isCollapsed && <RelayGroupsCount />}

              <nav className={cn('grid grid-cols-1 gap-4', isCollapsed && 'justify-center')}>
                <GroupsList />
              </nav>
            </div>

            <div className="mt-auto w-full pt-2">
              <ActiveUserInfo />
            </div>
          </div>
        </Sidebar>

        <div className="w-full">
          <div className="flex flex-col justify-between w-full h-full">
            {!activeGroupId ? (
              <div className="flex justify-center items-center h-full">Please select a Group</div>
            ) : (
              <>
                <ChatTopBar />
                <ChatList />
                <ChatBottomBar />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
