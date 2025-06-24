import { NDKUser } from '@nostr-dev-kit/ndk';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ChatBottomBar, ChatList, ChatPolls, ChatThreads, ChatTopBar } from '@/features/chats';
import { getCommunityTags } from '@/features/chats/chat-event/components/community/utils';
import { GroupsListWidget } from '@/features/groups';
import { RelayExplore, RelayInfo } from '@/features/relays';

import { useCommunity } from '@/shared/hooks';

import { CommunitySection, TabButton } from './components';

type GroupTabName = 'chats' | 'threads' | 'polls';
type ExploreTabName = 'explore' | 'groups' | 'info';

const getActiveTabFromUrl = (pathname: string): GroupTabName => {
  if (pathname.includes('/threads')) return 'threads';
  if (pathname.includes('/polls')) return 'polls';
  return 'chats';
};

export const ChatSections = ({
  activeRelay,
  activeGroupId,
  activeUser,
  isExploreMode,
}: {
  activeRelay: string | undefined;
  activeGroupId: string | undefined;
  activeUser: NDKUser | null | undefined;
  isExploreMode?: boolean;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>(() =>
    isExploreMode ? 'explore' : getActiveTabFromUrl(location.pathname),
  );

  const { isCommunity, communityEvent } = useCommunity(activeGroupId);

  useEffect(() => {
    if (isExploreMode) {
      setActiveTab('explore');
    } else {
      const tabFromUrl = getActiveTabFromUrl(location.pathname);
      if (isCommunity) {
        setActiveTab('chats');
      } else {
        setActiveTab(tabFromUrl);
      }
    }
  }, [location.pathname, isCommunity, activeRelay, activeGroupId, isExploreMode]);

  const { contentSections } = useMemo(
    () => getCommunityTags(communityEvent?.rawEvent() ?? null),
    [communityEvent],
  );

  const handleGroupTabChange = (groupTabName: GroupTabName) => {
    setActiveTab(groupTabName);
    const routes = {
      chats: `/?relay=${activeRelay}&groupId=${activeGroupId}`,
      threads: `/threads?relay=${activeRelay}&groupId=${activeGroupId}`,
      polls: `/polls?relay=${activeRelay}&groupId=${activeGroupId}`,
    };
    navigate(routes[groupTabName]);
  };

  const handleExploreTabChange = (exploreTabName: ExploreTabName) => {
    setActiveTab(exploreTabName);
  };

  if (isExploreMode) {
    return (
      <>
        <div className="w-full">
          <ChatTopBar />
          <div className="flex items-stretch divide-x overflow-x-auto pt-0.5">
            <TabButton
              isActive={activeTab === 'explore'}
              onClick={() => handleExploreTabChange('explore')}
            >
              Explore
            </TabButton>

            <TabButton
              isActive={activeTab === 'groups'}
              onClick={() => handleExploreTabChange('groups')}
            >
              Groups
            </TabButton>

            <TabButton
              isActive={activeTab === 'info'}
              onClick={() => handleExploreTabChange('info')}
            >
              Info
            </TabButton>

            <div className="flex-grow border-y"></div>
          </div>
        </div>

        {activeTab === 'explore' && <RelayExplore activeRelay={activeRelay} />}

        {activeTab === 'groups' && (
          <div className="flex flex-col justify-center items-center h-full overflow-y-auto">
            <GroupsListWidget />
          </div>
        )}

        {activeTab === 'info' && (
          <div className="flex flex-col items-center h-full overflow-y-auto">
            <RelayInfo activeRelay={activeRelay} />
          </div>
        )}
      </>
    );
  }

  if (isCommunity) {
    return (
      <>
        <div className="w-full">
          <ChatTopBar />
          <div className="flex items-stretch divide-x overflow-x-auto pt-0.5">
            <TabButton isActive={activeTab === 'chats'} onClick={() => setActiveTab('chats')}>
              Chats
            </TabButton>

            {contentSections.map((section) => (
              <TabButton
                key={section.name}
                isActive={activeTab === section.name.toLowerCase()}
                onClick={() => setActiveTab(section.name.toLowerCase())}
              >
                {section.name}
              </TabButton>
            ))}
            <div className="flex-grow border-y"></div>
          </div>
        </div>

        {activeTab === 'chats' && (
          <>
            <ChatList key={`${activeRelay}-${activeGroupId}`} />
            <div className="flex flex-col w-full mt-auto items-center gap-2 p-2">
              <ChatBottomBar />
            </div>
          </>
        )}

        {contentSections.map(
          (section) =>
            activeTab === section.name.toLowerCase() && (
              <CommunitySection
                key={section.name}
                kinds={section.kinds}
                groupId={activeGroupId}
                activeRelay={activeRelay}
              />
            ),
        )}
      </>
    );
  }

  return (
    <>
      <div className="w-full">
        <ChatTopBar />
        <div className="flex items-stretch divide-x overflow-x-auto pt-0.5">
          <TabButton isActive={activeTab === 'chats'} onClick={() => handleGroupTabChange('chats')}>
            Chats
          </TabButton>

          <TabButton
            isActive={activeTab === 'threads'}
            onClick={() => handleGroupTabChange('threads')}
          >
            Threads
          </TabButton>

          <TabButton isActive={activeTab === 'polls'} onClick={() => handleGroupTabChange('polls')}>
            Polls
          </TabButton>

          <div className="flex-grow border-y"></div>
        </div>
      </div>

      {activeTab === 'chats' && (
        <>
          <ChatList key={`${activeRelay}-${activeGroupId}`} />
          <div className="flex flex-col w-full mt-auto items-center gap-2 p-2">
            <ChatBottomBar />
          </div>
        </>
      )}
      {activeTab === 'threads' && <ChatThreads />}
      {activeTab === 'polls' && (
        <ChatPolls relay={activeRelay} groupId={activeGroupId} pubkey={activeUser?.pubkey} />
      )}
    </>
  );
};
