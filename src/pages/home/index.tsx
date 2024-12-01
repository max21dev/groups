import { ChatBottomBar, ChatList, ChatTopBar } from '@/features/chats';
import { GroupsFilterDropdown, GroupsList, GroupsListWidget } from '@/features/groups';
import { RelayList, RelaySelectDropdown } from '@/features/relays/';
import { ActiveUserInfo, UserLoginModal } from '@/features/users';

import { ModeToggle } from '@/shared/components/mode-toggle';
import { Sidebar } from '@/shared/components/sidebar';
import { ZapModal } from '@/shared/components/zap-modal';

import { useActiveRelay } from '@/shared/hooks';
import { cn } from '@/shared/utils';

import { useHomePage } from './hooks';

export function HomePage() {
  const { isCollapsed, activeGroupId, activeUser } = useHomePage();
  const { activeRelay } = useActiveRelay();

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
                {!activeRelay ? <RelayList /> : <GroupsListWidget />}
              </div>
            ) : (
              <>
                <ChatTopBar />
                <ChatList key={`${activeRelay}-${activeGroupId}`} />

                <div className="flex flex-col w-full mt-auto items-center gap-2 p-2">
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