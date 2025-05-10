import { MapPinIcon } from 'lucide-react';

import { NostrEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';

import { ChatContent } from '@/features/chats/chat-list/components/chat-list-item/components';
import { categorizeChatContent } from '@/features/chats/chat-list/components/chat-list-item/utils';

import { loader } from '@/shared/utils';

export const Picture = ({ event }: { event: NostrEvent }) => {
  const categorizedChatContent = useMemo(
    () => categorizeChatContent(event.content || ''),
    [event.content],
  );

  const titleTag = event.tags.find(([t]) => t === 'title');
  const title = titleTag ? titleTag[1] : '';

  const images = event.tags
    .filter(([t]) => t === 'imeta')
    .map((imetaTag) => {
      const urlTag = imetaTag.find((val) => val.startsWith('url '));
      const altTag = imetaTag.find((val) => val.startsWith('alt '));
      const dimensionsTag = imetaTag.find((val) => val.startsWith('dim '));

      return {
        url: urlTag ? urlTag.split(' ')[1] : null,
        alt: altTag ? altTag.split(' ')[1] : 'Image',
        dimensions: dimensionsTag ? dimensionsTag.split(' ')[1] : 'Unknown Size',
      };
    });

  const hashtags = event.tags.filter(([t]) => t === 't').map(([_, tag]) => `#${tag}`);

  const locationTag = event.tags.find(([t]) => t === 'location');
  const location = locationTag ? locationTag[1] : null;

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      <h5 className="text-lg font-semibold">{title}</h5>
      <div className="[&_*]:text-base">
        <ChatContent categorizedChatContent={categorizedChatContent} />
      </div>

      <div className="mt-4 space-y-4">
        {images.length > 0 &&
          images.map((img, index) =>
            img.url ? (
              <img key={index} src={loader(img.url)} alt={img.alt} className="w-full rounded-lg" />
            ) : null,
          )}
      </div>

      {location && (
        <p className="text-sm flex items-center gap-1 mt-2">
          <MapPinIcon size={18} className="text-red-700" /> <strong>Location:</strong> {location}
        </p>
      )}

      {hashtags.length > 0 && (
        <p className="text-sm text-secondary-foreground mt-2">
          <strong>Tags:</strong> {hashtags.join(', ')}
        </p>
      )}
    </div>
  );
};
