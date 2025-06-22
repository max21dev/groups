import { NostrEvent } from '@nostr-dev-kit/ndk';
import ReactPlayer from 'react-player';

import { RichText } from '@/shared/components/rich-text';
import { loader } from '@/shared/utils';

export const Video = ({ event }: { event: NostrEvent }) => {
  const titleTag = event.tags.find(([t]) => t === 'title');
  const title = titleTag ? titleTag[1] : '';

  const videoSources = event.tags
    .filter(([t]) => t === 'imeta')
    .map((imetaTag) => {
      const urlTag = imetaTag.find((val) => val.startsWith('url '));
      const fallbackTags = imetaTag.filter((val) => val.startsWith('fallback '));
      const thumbnailTag = imetaTag.find((val) => val.startsWith('image '));
      const durationTag = event.tags.find(([t]) => t === 'duration');

      return {
        url: urlTag ? urlTag.split(' ')[1] : null,
        fallbacks: fallbackTags.map((val) => val.split(' ')[1]),
        thumbnail: thumbnailTag ? thumbnailTag.split(' ')[1] : null,
        duration: durationTag ? durationTag[1] : 'Unknown',
      };
    });

  const hashtags = event.tags.filter(([t]) => t === 't').map(([_, tag]) => `#${tag}`);

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      <h5 className="text-lg font-semibold">{title}</h5>
      <div className="[&_*]:text-base">
        <RichText content={event.content} />
      </div>

      <div className="mt-4 space-y-4">
        {videoSources.length > 0 &&
          videoSources.map((video, index) =>
            video.url ? (
              <div key={index} className="max-w-full rounded-lg mt-2 react-player">
                <ReactPlayer
                  width="100%"
                  url={video.url}
                  controls
                  light={video.thumbnail ? loader(video.thumbnail) : false}
                />
              </div>
            ) : null,
          )}
      </div>

      {hashtags.length > 0 && (
        <p className="text-sm text-secondary-foreground mt-2">
          <strong>Tags:</strong> {hashtags.join(', ')}
        </p>
      )}
    </div>
  );
};
