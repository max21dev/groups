import { ChatEvent } from '@/features/chats/chat-event';

import { Spinner } from '@/shared/components/spinner';

import { SendChatPoll } from './components';
import { useChatPolls } from './hooks';

export const ChatPolls = ({
  relay,
  groupId,
  pubkey,
}: {
  relay: string | undefined;
  groupId: string | undefined;
  pubkey: string | undefined;
}) => {
  const { polls, isLoadingPolls } = useChatPolls(relay, groupId);

  return (
    <div className="overflow-y-auto flex flex-col items-center gap-2 p-2 [overflow-wrap:anywhere]">
      <SendChatPoll relay={relay} groupId={groupId} pubkey={pubkey} />

      {isLoadingPolls && <Spinner />}

      {!isLoadingPolls && !polls && <div className="w-full p-2 text-center">No polls found</div>}

      <div className="flex flex-col gap-2 items-center w-full sm:w-3/4">
        {polls.map((poll) => (
          <ChatEvent key={poll.id} event={poll.id} />
        ))}
      </div>
    </div>
  );
};
