import { ChatBottomBar, ChatEvent, ChatList, ChatTopBar } from '@/features/chats';
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
  const { isCollapsed, activeGroupId, activeUser, isMobile, event } = useHomePage();
  const { activeRelay } = useActiveRelay();

  return (
    <>
      <div className="flex w-full h-full overflow-hidden">
        <Sidebar className={cn('sm:block max-w-full w-full', activeGroupId && 'max-sm:hidden')}>
          <div className="flex flex-col w-full h-full">
            <div className="p-2">
              <div
                className={cn(
                  'flex gap-1 w-full',
                  isCollapsed && 'flex-col',
                  isMobile && 'flex-row',
                )}
              >
                <ModeToggle />

                {activeUser?.pubkey && <GroupsFilterDropdown />}

                <RelaySelectDropdown />
              </div>
            </div>

            <div
              className={cn(
                'p-2 flex flex-col h-full gap-4 overflow-y-hidden hover:overflow-y-auto max-sm:overflow-y-auto',
              )}
            >
              <GroupsList />

              {!activeRelay && (
                <RelayList className="sm:hidden sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1" />
              )}
            </div>

            <div className="mt-auto w-full">
              <ActiveUserInfo />
            </div>
          </div>
        </Sidebar>

        <div className={cn('w-full', 'sm:block', !activeGroupId && 'max-sm:hidden')}>
          <div className="flex flex-col w-full h-full">
            {event ? (
              <div className="flex flex-col items-center mt-8 h-full">
                <ChatEvent event={event} />
              </div>
            ) : !activeGroupId ? (
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
