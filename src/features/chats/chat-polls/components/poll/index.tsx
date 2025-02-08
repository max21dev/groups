import { VoteIcon } from 'lucide-react';

import { NDKEvent } from '@nostr-dev-kit/ndk';

import { ChatContent } from '@/features/chats/chat-list/components/chat-list-item/components';
import { Vote } from '@/features/chats/chat-polls/components/vote';

import { Button } from '@/shared/components/ui/button';

import { usePoll } from './hooks';

export const Poll = ({ poll }: { poll: NDKEvent }) => {
  const {
    categorizedChatContent,
    options,
    pollType,
    endsAt,
    selectedOptions,
    setSelectedOptions,
    sendVote,
    canVote,
  } = usePoll(poll);

  return (
    <div className="flex flex-col gap-2 w-full">
      <ChatContent categorizedChatContent={categorizedChatContent} />

      {endsAt && (
        <p className="text-sm text-gray-500">Ends at: {new Date(endsAt * 1000).toLocaleString()}</p>
      )}

      <ul className="m-0 space-y-2">
        {options.map((option) => (
          <Vote
            key={option.id}
            pollId={poll.id}
            pollType={pollType}
            optionId={option.id}
            label={option.label}
            votes={option.votes}
            canVote={canVote}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          />
        ))}
      </ul>

      {canVote && (
        <Button
          className="w-fit flex items-center justify-self-center gap-1"
          onClick={() => sendVote(selectedOptions)}
          disabled={!selectedOptions.length}
        >
          Vote
          <VoteIcon size={20} />
        </Button>
      )}
    </div>
  );
};
