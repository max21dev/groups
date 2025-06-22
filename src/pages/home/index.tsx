import { ChatEvent, ChatSections } from '@/features/chats';
import {
  GroupsFilterDropdown,
  GroupsList,
  GroupsListPinned,
  GroupsListWidget,
  GroupsSearch,
} from '@/features/groups';
import { RelayList, RelaySelectDropdown } from '@/features/relays/';
import { ActiveUserInfo, UserLoginModal, UserWallets } from '@/features/users';

import { ModeToggle } from '@/shared/components/mode-toggle';
import { Sidebar } from '@/shared/components/sidebar';
import { ZapModal } from '@/shared/components/zap-modal';

import { cn } from '@/shared/utils';

import { useHomePage } from './hooks';

export function HomePage() {
  const { isCollapsed, activeGroupId, activeUser, isMobile, event, activeRelay, isWalletsVisible } =
    useHomePage();

  return (
    <>
      <div className="flex w-full h-full overflow-hidden">
        <Sidebar
          className={cn(
            'sm:block max-w-full w-full',
            (activeGroupId || event || isWalletsVisible) && 'max-sm:hidden',
          )}
        >
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

                {activeRelay && <GroupsSearch />}
              </div>
            </div>

            <div
              id="scrollableGroupsList"
              className={cn(
                'p-2 flex flex-col h-full gap-4 overflow-y-hidden hover:overflow-y-auto max-sm:overflow-y-auto',
              )}
            >
              <GroupsListPinned />

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

        <div
          className={cn(
            'w-full',
            'sm:block',
            !(activeGroupId || event || isWalletsVisible) && 'max-sm:hidden',
          )}
        >
          <div className="flex flex-col w-full h-full">
            {isWalletsVisible ? (
              <div className="flex flex-col items-center h-full overflow-y-auto">
                <UserWallets />
              </div>
            ) : event ? (
              <div className="flex flex-col items-center px-2 py-8 h-full overflow-y-auto">
                <ChatEvent event={event} />
              </div>
            ) : !activeGroupId ? (
              <div className="flex flex-col justify-center items-center h-full">
                {!activeRelay ? <RelayList /> : <GroupsListWidget />}
              </div>
            ) : (
              <ChatSections
                activeRelay={activeRelay}
                activeGroupId={activeGroupId}
                activeUser={activeUser}
              />
            )}
          </div>
        </div>
      </div>

      <UserLoginModal />
      <ZapModal />
    </>
  );
}
