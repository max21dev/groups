import { SendIcon } from 'lucide-react';

import { NostrEvent } from '@nostr-dev-kit/ndk';

import { Vote } from '@/features/chats/chat-polls/components/vote';

import { RichText } from '@/shared/components/rich-text';
import { Button } from '@/shared/components/ui/button';
import { formatTimestampToDate } from '@/shared/utils';

import { usePoll } from './hooks';

export const Poll = ({ poll }: { poll: NostrEvent }) => {
  const {
    options,
    pollType,
    endsAt,
    selectedOptions,
    setSelectedOptions,
    sendVote,
    totalVotes,
    canVote,
  } = usePoll(poll);

  return (
    <div className="w-full set-max-h flex flex-col gap-2 p-2 overflow-y-auto">
      <RichText content={poll.content} />

      <ul className="m-0 space-y-2">
        {options.map((option) => (
          <Vote
            key={option.id}
            pollId={poll.id || ''}
            pollType={pollType}
            optionId={option.id}
            label={option.label}
            votes={option.votes}
            totalVotes={totalVotes}
            canVote={canVote}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          />
        ))}
      </ul>

      <div className="flex justify-between items-end gap-2">
        {endsAt && (
          <p className="w-fit text-xs text-muted-foreground">
            {Date.now() > endsAt * 1000
              ? 'Poll closed'
              : `Ends at: ${formatTimestampToDate(endsAt)}`}
          </p>
        )}

        {canVote && (
          <Button
            className="w-fit flex items-center justify-self-center gap-1"
            onClick={() => sendVote(selectedOptions)}
            disabled={!selectedOptions.length}
          >
            Vote
            <SendIcon size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};
