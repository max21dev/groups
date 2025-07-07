import { Calendar as CalendarIcon, Users } from 'lucide-react';

import { NostrEvent } from '@nostr-dev-kit/ndk';

import { RichText } from '@/shared/components/rich-text';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { CalendarEventPreview } from './components';
import { useCalendar } from './hooks';

export const Calendar = ({ event }: { event: NostrEvent }) => {
  const { title, description, calendarEvents, isLoading } = useCalendar(event);

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <CalendarIcon size={20} className="text-primary" />
        <h4 className="text-lg font-bold leading-tight">{title}</h4>
      </div>

      {description && (
        <div className="[&_*]:text-sm border-l-2 border-primary/20 pl-3">
          <RichText content={description} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-muted-foreground" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ) : calendarEvents.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground bg-secondary/50 rounded-lg p-4">
          <CalendarIcon size={24} className="mx-auto mb-2 opacity-50" />
          No events in this calendar yet
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users size={16} className="text-primary" />
            {calendarEvents.length} event{calendarEvents.length !== 1 ? 's' : ''}
          </div>
          <div className="space-y-2">
            {calendarEvents.map((calendarEvent) => (
              <CalendarEventPreview key={calendarEvent.id} event={calendarEvent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};