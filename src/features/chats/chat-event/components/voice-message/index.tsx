import { NostrEvent } from '@nostr-dev-kit/ndk';

export const VoiceMessage = ({ event }: { event: NostrEvent }) => {
  const titleTag = event.tags.find(([t]) => t === 'title');
  const title = titleTag ? titleTag[1] : '';

  const imetaTags = event.tags.filter(([t]) => t === 'imeta');
  const audioSources = imetaTags.map((imetaTag) => {
    const urlTag = imetaTag.find((val) => val.startsWith('url '));
    const durationTag = imetaTag.find((val) => val.startsWith('duration '));
    const waveformTag = imetaTag.find((val) => val.startsWith('waveform '));
    return {
      url: urlTag ? urlTag.split(' ')[1] : event.content,
      duration: durationTag ? durationTag.split(' ')[1] : undefined,
      waveform: waveformTag
        ? waveformTag
            .split(' ')
            .slice(1)
            .map((v) => parseFloat(v))
        : [],
    };
  });

  const hashtags = event.tags.filter(([t]) => t === 't').map(([, tag]) => `#${tag}`);

  return (
    <div className="w-full flex flex-col gap-2 p-2">
      {title && <h5 className="text-lg font-semibold">{title}</h5>}

      <div className="mt-4 space-y-4">
        {audioSources.map((audio, index) =>
          audio.url ? (
            <div key={index} className="w-full rounded-lg mt-2">
              <audio controls src={audio.url} className="w-full" preload="metadata" />
              {audio.duration && (
                <p className="text-sm text-secondary-foreground mt-1">
                  <strong>Duration:</strong> {audio.duration}s
                </p>
              )}
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
