import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Poll } from '@/features/chats/chat-polls/components';
import { ChatThreadComments } from '@/features/chats/chat-threads/components';
import { GroupWidget } from '@/features/groups';
import { UserAvatar } from '@/features/users';

import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn, ellipsis, formatTimestampToDate } from '@/shared/utils';

import {
  AddEventReaction,
  ChatEventMenu,
  ChatEventReactions,
  FollowSet,
  Highlight,
  LiveStream,
  LongFormContent,
  Note,
  Picture,
} from './components';
import { useChatEvent } from './hook';

export const ChatEvent = memo(
  ({
    event,
    isChatThread,
    deleteThreadComment,
  }: {
    event: string;
    isChatThread?: boolean;
    deleteThreadComment?: (commentId: string) => void;
  }) => {
    const {
      eventRef,
      eventData,
      profile,
      category,
      isThreadsVisible,
      reactions,
      refreshReactions,
      isChatsPage,
    } = useChatEvent(event);

    const navigate = useNavigate();

    if (eventData === undefined) {
      return (
        <div ref={eventRef} className="w-full rounded-xl bg-primary/10 max-w-2xl p-2 space-y-3">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      );
    }

    if (eventData === null && deleteThreadComment !== undefined) {
      return null;
    }

    if (eventData === null) {
      return <p className="text-xs">{event}</p>;
    }

    return (
      <>
        {!isChatsPage && isChatThread && !isThreadsVisible && (
          <div className="w-full max-w-2xl">
            <Button variant="outline" className="me-auto mb-2" onClick={() => navigate(-1)}>
              Back to threads
            </Button>
          </div>
        )}
        <div
          ref={eventRef}
          className={cn(
            'w-full rounded-xl p-2 bg-primary/10',
            category === 'group' && 'p-0',
            isChatsPage
              ? 'max-w-80 [&_.set-max-h]:max-h-80'
              : 'max-w-2xl [&_.set-max-h]:max-h-[75vh]',
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
                <ChatEventMenu
                  event={event}
                  isChatThread={isChatThread}
                  deleteThreadComment={deleteThreadComment}
                  pubkey={eventData.pubkey}
                />
              </div>
            </div>
          )}
          {category === 'follow-set' && <FollowSet tags={eventData.tags} address={event} />}
          {category === 'group' && <GroupWidget groupId={eventData.tags[0][1]} />}
          {category === 'note' && <Note content={eventData.content} />}
          {category === 'poll' && <Poll poll={eventData} />}
          {category === 'long-form-content' && <LongFormContent content={eventData.content} />}
          {category === 'highlight' && <Highlight event={eventData} />}
          {category === 'live-stream' && <LiveStream event={eventData} />}
          {category === 'picture' && <Picture event={eventData} />}

          <div className="flex justify-between items-center mt-2">
            {category !== 'group' && reactions && reactions.length > 0 && (
              <ChatEventReactions reaction={reactions} />
            )}

            {category !== 'group' && !isChatsPage && (
              <div className="flex ms-auto">
                <AddEventReaction
                  eventId={eventData.id}
                  pubkey={eventData.pubkey}
                  content={eventData.content}
                  profile={profile}
                  refreshReactions={refreshReactions}
                />
              </div>
            )}
          </div>

          {!isThreadsVisible && isChatThread && <ChatThreadComments parentId={event} />}
        </div>
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.event === nextProps.event && prevProps.isChatThread === nextProps.isChatThread,
);
