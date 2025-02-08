import { NDKKind } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect } from 'react';

import { usePollsStore } from '@/features/chats/chat-polls/store';

export const useChatPolls = (relay: string | undefined, groupId: string | undefined) => {
  const { polls, isLoadingPolls, setPolls, setIsLoadingPolls, resetState } = usePollsStore();
  const { ndk } = useNdk();

  useEffect(() => {
    resetState(relay, groupId);
    fetchChatPolls();
  }, [relay, groupId, ndk]);

  const fetchChatPolls = async () => {
    if (!ndk || !relay || !groupId) return;
    setIsLoadingPolls(true);

    const events = await ndk.fetchEvents({
      kinds: [1068 as NDKKind],
      '#h': [groupId],
    });

    const eventsArray = Array.from(events);

    setPolls(eventsArray);
    setIsLoadingPolls(false);
  };

  return { polls, isLoadingPolls, fetchChatPolls };
};
