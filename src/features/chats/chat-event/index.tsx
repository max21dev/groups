import { cn, ellipsis, formatTimestampToDate } from '@/shared/utils';

import { Spinner } from '@/shared/components/spinner';

import { GroupWidget } from '@/features/groups';
import { UserAvatar } from '@/features/users';

import { FollowSet, Note } from './components';
import { ChatEventMenu } from './components/chat-event-menu';
import { useChatEvent } from './hook';

export const ChatEvent = ({
                            event,
                            sameAsCurrentUser,
                          }: {
  event: string;
  sameAsCurrentUser?: boolean;
}) => {
  const { eventData, profile, category } = useChatEvent(event);

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
          'rounded-xl overflow-hidden p-2',
          sameAsCurrentUser ? 'bg-blue-700' : 'bg-zinc-200 dark:bg-zinc-700',
          category === 'group' && 'p-0',
          sameAsCurrentUser !== undefined ? 'max-w-80' : 'max-w-2xl',
        )}
      >
        {category !== 'group' && (
          <div className="flex items-center gap-2 mb-2">
            {profile && (
              <>
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
              </>
            )}
            <div className="ml-auto">
              <ChatEventMenu event={event} />
            </div>
          </div>
        )}
        {category === 'follow-set' && <FollowSet tags={eventData.tags} address={event} />}
        {category === 'group' && <GroupWidget groupId={eventData.tags[0][1]} />}
        {category === 'note' && <Note content={eventData.content} />}
        {category === 'long-form-content' && <Note content={eventData.content} />}
      </div>
    </>
  );
};