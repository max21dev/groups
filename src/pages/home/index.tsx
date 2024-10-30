import { ChatBottomBar, ChatList, ChatTopBar } from '@/features/chats';
import { GroupsFilterDropdown, GroupsList } from '@/features/groups';
import { RelayGroupsCount, RelaySelectDropdown } from '@/features/relays';
import { ActiveUserInfo } from '@/features/users';

import { ModeToggle } from '@/shared/components/mode-toggle';
import { Sidebar } from '@/shared/components/sidebar';

import { cn } from '@/shared/utils';

import { useHomePage } from './hooks';
import { CreateGroup } from '@/features/groups/create-group/inxdex.tsx';

export function HomePage() {
  const { isCollapsed, activeGroupId, activeUser } = useHomePage();

  return (
    <>
      <div className="flex w-full h-full">
        <Sidebar>
          <div className="flex flex-col w-full h-full">
            <div className="p-2">
              <div className="flex gap-1">
                {!isCollapsed && <ModeToggle />}

                <RelaySelectDropdown />
              </div>

              {activeUser?.pubkey && (
                <div className="mt-2 flex gap-1">
                  <GroupsFilterDropdown />
                </div>
              )}
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
                <h3>Please select a Group from the list on the left </h3>
                <span className="m-8">Or</span>
                <CreateGroup />
              </div>
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
