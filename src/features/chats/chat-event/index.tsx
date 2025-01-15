import { memo } from 'react';

import { cn, ellipsis, formatTimestampToDate } from '@/shared/utils';

import { Spinner } from '@/shared/components/spinner';

import { ChatThreadComments } from '@/features/chats/chat-threads/components';
import { GroupWidget } from '@/features/groups';
import { UserAvatar } from '@/features/users';

import { ChatEventMenu, FollowSet, LongFormContent, Note } from './components';
import { useChatEvent } from './hook';

export const ChatEvent = memo(
  ({
    event,
    sameAsCurrentUser,
    isChatThread,
  }: {
    event: string;
    sameAsCurrentUser?: boolean;
    isChatThread?: boolean;
  }) => {
    const { eventData, profile, category, isThreadsVisible } = useChatEvent(event);

    if (eventData === undefined) {
      return (
        <div className="w-5 h-5">
          <Spinner />
        </div>
      );
    }

    if (eventData === null) {
      return <p className="text-xs">{event}</p>;
    }

    return (
      <>
        <div
          className={cn(
            'w-full rounded-xl p-2',
            sameAsCurrentUser ? 'bg-blue-700' : 'bg-zinc-200 dark:bg-zinc-700',
            category === 'group' && 'p-0',
            sameAsCurrentUser !== undefined
              ? 'max-w-80 [&_.set-max-h]:max-h-80'
              : 'max-w-2xl [&_.set-max-h]:max-h-[85vh]',
          )}
        >
          {category !== 'group' && (
            <div className="flex items-center gap-2 mb-2">
              <UserAvatar pubkey={eventData.pubkey} />
              <div className="flex flex-col">
                <span>
                  {profile?.name ||
                    profile?.displayName ||
                    profile?.nip05 ||
                    ellipsis(eventData.pubkey, 4)}
                </span>
                <span className="text-xs">
                  {eventData.created_at && formatTimestampToDate(eventData.created_at)}
                </span>
              </div>
              <div className="ml-auto">
                <ChatEventMenu event={event} isChatThread={isChatThread} />
              </div>
            </div>
          )}
          {category === 'follow-set' && <FollowSet tags={eventData.tags} address={event} />}
          {category === 'group' && <GroupWidget groupId={eventData.tags[0][1]} />}
          {category === 'note' && (
            <Note content={eventData.content} sameAsCurrentUser={sameAsCurrentUser} />
          )}
          {category === 'long-form-content' && <LongFormContent content={eventData.content} />}

          {!isThreadsVisible && isChatThread && <ChatThreadComments parentId={event} />}
        </div>
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.event === nextProps.event &&
    prevProps.isChatThread === nextProps.isChatThread &&
    prevProps.sameAsCurrentUser === nextProps.sameAsCurrentUser,
);
