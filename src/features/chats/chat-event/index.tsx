import { CheckIcon, Copy, OctagonAlertIcon } from 'lucide-react';
import { memo } from 'react';

import { Poll } from '@/features/chats/chat-polls/components';
import { GroupWidget } from '@/features/groups';
import { UserAvatar } from '@/features/users';

import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useCopyToClipboard } from '@/shared/hooks';
import { cn, ellipsis, formatTimestampToDate } from '@/shared/utils';

import {
  AddEventReaction,
  AppRecommendation,
  BadgeDefinition,
  Calendar,
  CalendarEvent,
  ChatEventMenu,
  ChatEventObject,
  ChatEventReactions,
  ChatMessageEvent,
  CodeSnippet,
  Community,
  EmojiSet,
  FollowSet,
  GitRepo,
  Highlight,
  LiveStream,
  LongFormContent,
  ModeratedCommunity,
  Note,
  Picture,
  PublicationContent,
  PublicationIndex,
  Video,
  Wiki,
  ZapGoal,
} from './components';
import { useChatEvent } from './hook';
import { isExcludedCategory } from './utils';

export const ChatEvent = memo(
  ({
    event,
    deleteThreadComment,
    eventPreview = false,
  }: {
    event: string;
    deleteThreadComment?: (commentId: string) => void;
    eventPreview?: boolean;
  }) => {
    const { eventRef, eventData, profile, category, reactions, refreshReactions } =
      useChatEvent(event);

    const { copyToClipboard, hasCopied } = useCopyToClipboard();

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
      return (
        <div className="w-full max-w-2xl flex flex-col items-center justify-center p-4 rounded-lg bg-primary/10">
          <p className="flex items-center gap-1 text-sm mb-2">
            <OctagonAlertIcon size={18} />
            Event not found.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(event)}
            className="text-xs w-full bg-primary/15 hover:bg-primary/25 text-current hover:text-current"
          >
            {hasCopied ? (
              <>
                <CheckIcon className="text-green-600 me-1.5" size={15} /> Copied!
              </>
            ) : (
              <>
                <Copy className="me-1.5" size={15} /> Copy Event ID
              </>
            )}
          </Button>
        </div>
      );
    }

    if (category && isExcludedCategory(category)) {
      return (
        <div ref={eventRef}>
          {category === 'group' && <GroupWidget groupId={eventData.tags[0][1]} />}
          {category === 'chat-message' && <ChatMessageEvent event={eventData} />}
        </div>
      );
    }

    return (
      <div
        ref={eventRef}
        className={cn(
          'w-full rounded-xl p-2 bg-primary/10',
          eventPreview
            ? 'max-w-80 [&_.set-max-h]:max-h-80'
            : 'max-w-2xl [&_.set-max-h]:max-h-[75vh]',
        )}
      >
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
              deleteThreadComment={deleteThreadComment}
              pubkey={eventData.pubkey}
            />
          </div>
        </div>
        {category === 'follow-set' && <FollowSet tags={eventData.tags} address={event} />}
        {category === 'emoji-set' && <EmojiSet event={eventData} />}
        {(category === 'note' || category === 'thread' || category === 'comment') && (
          <Note content={eventData.content} />
        )}
        {category === 'poll' && <Poll poll={eventData} />}
        {category === 'code-snippet' && <CodeSnippet event={eventData} />}
        {category === 'long-form-content' && <LongFormContent content={eventData.content} />}
        {category === 'highlight' && <Highlight event={eventData} />}
        {category === 'live-stream' && <LiveStream event={eventData} />}
        {category === 'picture' && <Picture event={eventData} />}
        {category === 'video' && <Video event={eventData} />}
        {category === 'community' && <Community event={eventData} />}
        {category === 'git-repo' && <GitRepo event={eventData} />}
        {category === 'app-recommendation' && <AppRecommendation event={eventData} />}
        {category === 'zap-goal' && <ZapGoal event={eventData} />}
        {category === 'badge-definition' && <BadgeDefinition event={eventData} />}
        {category === 'calendar-event' && <CalendarEvent event={eventData} />}
        {category === 'calendar' && <Calendar event={eventData} />}
        {category === 'moderated-community' && <ModeratedCommunity event={eventData} />}
        {category === 'publication-index' && <PublicationIndex event={eventData} />}
        {category === 'publication-content' && <PublicationContent event={eventData} />}
        {category === 'wiki' && <Wiki event={eventData} />}
        {category === null && <ChatEventObject event={eventData} />}

        <div className="flex justify-between items-center mt-2">
          {reactions && reactions.length > 0 && (
            <ChatEventReactions
              eventId={eventData.id || ''}
              eventPubkey={eventData.pubkey}
              reaction={reactions}
              refreshReactions={refreshReactions}
            />
          )}

          {!eventPreview && (
            <div className="flex ms-auto">
              <AddEventReaction
                eventId={eventData.id || ''}
                pubkey={eventData.pubkey}
                content={eventData.content}
                profile={profile}
                refreshReactions={refreshReactions}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.event === nextProps.event &&
    prevProps.deleteThreadComment === nextProps.deleteThreadComment &&
    prevProps.eventPreview === nextProps.eventPreview,
);
