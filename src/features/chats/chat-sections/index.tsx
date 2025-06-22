import { NDKUser } from '@nostr-dev-kit/ndk';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChatBottomBar, ChatList, ChatPolls, ChatThreads, ChatTopBar } from '@/features/chats';
import { getCommunityTags } from '@/features/chats/chat-event/components/community/utils';

import { useCommunity } from '@/shared/hooks';

import { CommunitySection, TabButton } from './components';

type GroupTabName = 'chats' | 'threads' | 'polls';

export const ChatSections = ({
  activeRelay,
  activeGroupId,
  activeUser,
}: {
  activeRelay: string | undefined;
  activeGroupId: string | undefined;
  activeUser: NDKUser | null | undefined;
}) => {
  const [activeTab, setActiveTab] = useState<string>('chats');

  const { isCommunity, communityEvent } = useCommunity(activeGroupId);

  useEffect(() => {
    setActiveTab('chats');
  }, [activeRelay, activeGroupId]);

  const { contentSections } = useMemo(
    () => getCommunityTags(communityEvent?.rawEvent() ?? null),
    [communityEvent],
  );

  const navigate = useNavigate();

  const handleGroupTabChange = (groupTabName: GroupTabName) => {
    setActiveTab(groupTabName);
    const routes = {
      chats: `/?relay=${activeRelay}&groupId=${activeGroupId}`,
      threads: `/threads?relay=${activeRelay}&groupId=${activeGroupId}`,
      polls: `/polls?relay=${activeRelay}&groupId=${activeGroupId}`,
    };
    navigate(routes[groupTabName]);
  };

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
