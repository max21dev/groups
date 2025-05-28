import {
  CalendarDays,
  CheckCircle,
  Hourglass,
  Navigation,
  UserCheck,
  UserMinus,
} from 'lucide-react';

import { NostrEvent } from '@nostr-dev-kit/ndk';

import { ChatContent } from '@/features/chats/chat-list/components/chat-list-item/components';

import { Button } from '@/shared/components/ui/button';
import { cn, formatTimestampToDate } from '@/shared/utils';

import { useCalendarEvent } from './hooks';

export const CalendarEvent = ({ event }: { event: NostrEvent }) => {
  const {
    title,
    description,
    image,
    startTime,
    endTime,
    timezone,
    location,
    hasEventEnded,
    attending,
    maybeAttending,
    notAttending,
    userAttendanceStatus,
    isSubmitting,
    submitAttendanceResponse,
    categorizedChatContent,
  } = useCalendarEvent(event);

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      {image && (
        <img
          src={image}
          alt={title || 'Event Image'}
          className="w-full aspect-auto max-h-48 object-cover rounded-lg"
        />
      )}

      <div className="flex flex-col gap-4">
        <h4 className="text-lg font-bold leading-tight">{title}</h4>

        <div className="space-y-3">
          {startTime && (
            <div className="flex items-start gap-3">
              <CalendarDays size={16} className="text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <div className="font-medium">
                  {formatTimestampToDate(Number(startTime))}
                  {endTime && endTime !== startTime && (
                    <> until {formatTimestampToDate(Number(endTime))}</>
                  )}
                </div>
                {timezone && <div className="text-xs text-muted-foreground mt-1">{timezone}</div>}
              </div>
            </div>
          )}

          {location && (
            <div className="flex items-start gap-3">
              <span className="w-5 h-5">
                <Navigation size={16} className="text-muted-foreground mt-0.5" />
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-pink-400 underline"
              >
                {location}
              </a>
            </div>
          )}
        </div>

        {description && (
          <div className="[&_*]:text-sm border-l-2 border-primary/20 pl-3">
            <ChatContent categorizedChatContent={categorizedChatContent} />
          </div>
        )}

        {(attending?.count || maybeAttending?.count || notAttending?.count) && (
          <div className="bg-primary/5 rounded-lg p-3">
            <div className="text-sm font-medium mb-2">Event Response Summary</div>
            <div className="flex flex-wrap gap-3 text-sm">
              {attending && attending.count > 0 && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <UserCheck size={15} />
                  <strong>{attending.count}</strong> attending
                </span>
              )}
              {maybeAttending && maybeAttending.count > 0 && (
                <span className="flex items-center gap-1 text-amber-600">
                  <Hourglass size={15} />
                  <strong>{maybeAttending.count}</strong> maybe
                </span>
              )}
              {notAttending && notAttending.count > 0 && (
                <span className="flex items-center gap-1 text-rose-600">
                  <UserMinus size={15} />
                  <strong>{notAttending.count}</strong> declined
                </span>
              )}
            </div>
          </div>
        )}

        {!hasEventEnded && (
          <div className="space-y-3">
            <div className="text-sm font-medium">Your Response:</div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => submitAttendanceResponse('accepted')}
                disabled={isSubmitting}
                className={cn(
                  'flex flex-col items-center gap-1 h-auto py-2 text-foreground',
                  userAttendanceStatus === 'accepted' && 'bg-emerald-500 hover:bg-emerald-600',
                )}
              >
                {userAttendanceStatus === 'accepted' ? (
                  <CheckCircle size={18} />
                ) : (
                  <UserCheck size={18} />
                )}
                <span className="text-xs">Attending</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => submitAttendanceResponse('tentative')}
                disabled={isSubmitting}
                className={cn(
                  'flex flex-col items-center gap-1 h-auto py-2 text-foreground',
                  userAttendanceStatus === 'tentative' && 'bg-amber-500 hover:bg-amber-600',
                )}
              >
                {userAttendanceStatus === 'tentative' ? (
                  <CheckCircle size={18} />
                ) : (
                  <Hourglass size={18} />
                )}
                <span className="text-xs">Maybe</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => submitAttendanceResponse('declined')}
                disabled={isSubmitting}
                className={cn(
                  'flex flex-col items-center gap-1 h-auto py-2 text-foreground',
                  userAttendanceStatus === 'declined' && 'bg-rose-500 hover:bg-rose-600',
                )}
              >
                {userAttendanceStatus === 'declined' ? (
                  <CheckCircle size={18} />
                ) : (
                  <UserMinus size={18} />
                )}
                <span className="text-xs">Can't Go</span>
              </Button>
            </div>
          </div>
        )}

        {hasEventEnded && (
          <div className="text-center text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3">
            This event has concluded
          </div>
        )}
      </div>
    </div>
  );
};
