import { Clock, MapPin } from 'lucide-react';

import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useSearchParams } from 'react-router-dom';

import { formatTimestampToDate, getNostrLink } from '@/shared/utils';

export const CalendarEventPreview = ({ event }: { event: NDKEvent }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const title = event.tags.find((tag) => tag[0] === 'title')?.[1] || 'Untitled Event';
  const startTime = event.tags.find((tag) => tag[0] === 'start')?.[1];
  const endTime = event.tags.find((tag) => tag[0] === 'end')?.[1];
  const location = event.tags.find((tag) => tag[0] === 'location')?.[1];
  const isTimeBasedEvent = event.kind === 31923;

  const setEventId = () => {
    const newParams = new URLSearchParams(searchParams);
    const eventLink = getNostrLink(event.id, event.pubkey, event.kind!);

    if (eventLink) {
      newParams.set('eventId', eventLink);
    }

    setSearchParams(newParams);
  };

  const formatEventTime = () => {
    if (!startTime) return null;

    if (isTimeBasedEvent) {
      const startDate = formatTimestampToDate(Number(startTime));
      const endDate =
        endTime && endTime !== startTime ? formatTimestampToDate(Number(endTime)) : null;

      return endDate ? `${startDate} - ${endDate}` : startDate;
    } else {
      const endDate = endTime && endTime !== startTime ? ` - ${endTime}` : '';
      return `${startTime}${endDate}`;
    }
  };

  return (
    <div
      className="bg-primary/5 rounded-lg p-3 hover:cursor-pointer hover:bg-primary/15 transition-colors"
      onClick={() => setEventId()}
    >
      <h5 className="font-medium text-sm mb-2">{title}</h5>

      <div className="space-y-1 text-xs">
        {startTime && (
          <div className="flex items-center gap-2">
            <Clock size={12} />
            <span>{formatEventTime()}</span>
          </div>
        )}

        {location && (
          <div className="flex items-center gap-2">
            <MapPin size={12} />
            <span className="truncate">{location}</span>
          </div>
        )}
      </div>
    </div>
  );
};