import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

export const EmojiSet = ({ event }: { event: NDKEvent }) => {
  const getTagValue = (key: string) => {
    const foundTag = event.tags.find(([tag]) => tag === key);
    return foundTag ? foundTag[1] : null;
  };

  const d = getTagValue('d');
  const title = getTagValue('title');

  const emojiTags = useMemo(() => {
    return event.tags.filter((tag) => tag[0] === 'emoji');
  }, [event.tags]);

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      {title && <h5 className="text-lg font-semibold">{title}</h5>}
      {d && <p className="text-sm text-secondary-foreground">{d}</p>}

      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
        {emojiTags.map((tag, index) => {
          const shortCode = tag[1];
          const imageUrl = tag[2];

          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <img src={imageUrl} alt={shortCode} className="w-8 h-8 mx-auto object-cover" />
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-xs">{shortCode}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};
