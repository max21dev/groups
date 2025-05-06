import { NostrEvent } from '@nostr-dev-kit/ndk';

import { Button } from '@/shared/components/ui/button';
import { formatTimestampToDate } from '@/shared/utils';

export const LiveStream = ({ event }: { event: NostrEvent }) => {
  const getTagValue = (key: string) => {
    const tag = event.tags.find(([t]) => t === key);
    return tag ? tag[1] : null;
  };

  const title = getTagValue('title');
  const summary = getTagValue('summary');
  const streamingUrl = getTagValue('streaming');
  const status = getTagValue('status');
  const imageUrl = getTagValue('image');
  const currentParticipants = getTagValue('current_participants');
  const totalParticipants = getTagValue('total_participants');
  const hashtags = event.tags.filter(([t]) => t === 't').map(([_, value]) => value);
  const starts = getTagValue('starts');
  const ends = getTagValue('ends');

  const eventTime =
    status === 'planned'
      ? starts
        ? `Starts at: ${formatTimestampToDate(+starts)}`
        : '-'
      : status === 'ended'
        ? `Ended at: ${ends ? formatTimestampToDate(+ends) : '-'}`
        : null;

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title || 'Live Event'}
          className="w-full h-52 object-cover rounded-lg mb-4"
        />
      )}
      <div className="flex gap-2 items-center mb-2">
        {status === 'live' && (
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
        )}
        <h5 className="text-xl font-bold">{title || 'Untitled Event'}</h5>
      </div>
      <p className="mb-2">{summary || 'No description available.'}</p>
      {eventTime && <p className="text-sm mb-2">{eventTime}</p>}
      {currentParticipants && totalParticipants && (
        <p className="text-sm mb-2">
          Participants: {currentParticipants} / {totalParticipants}
        </p>
      )}
      {hashtags.length > 0 && (
        <p className="text-sm text-secondary-foreground">
          {hashtags.map((tag) => `#${tag}`).join(', ')}
        </p>
      )}
      {streamingUrl && (
        <a href={streamingUrl} target="_blank" rel="noopener noreferrer">
          <Button>Watch Live</Button>
        </a>
      )}
    </div>
  );
};
