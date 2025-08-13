import { NDKTag } from '@nostr-dev-kit/ndk';

import { cn } from '@/shared/utils';

import { useEmojiRenderer } from './hooks';

export const EmojiRenderer = ({
  shortcode,
  className = '',
  tags,
}: {
  shortcode: string;
  className?: string;
  tags?: NDKTag[];
}) => {
  const { findEmoji } = useEmojiRenderer();

  const cleanShortcode = shortcode.replace(/^:|:$/g, '');

  const t = tags?.find((t) => t[0] === 'emoji' && t[1] === cleanShortcode);
  if (t?.[2]) {
    const img = t[2];
    const addr = t[3];
    return (
      <img
        src={img}
        alt={`:${cleanShortcode}:`}
        title={`:${cleanShortcode}:`}
        className={cn('inline-block size-5 align-text-bottom', className)}
        data-address={addr || undefined}
        loading="lazy"
      />
    );
  }

  const result = findEmoji(cleanShortcode);
  if (result?.emoji) {
    return (
      <img
        src={result.emoji.image}
        alt={`:${cleanShortcode}:`}
        title={`:${cleanShortcode}:`}
        className={cn('inline-block size-5 align-text-bottom', className)}
        loading="lazy"
      />
    );
  }

  return <span className="text-sm">{`:${cleanShortcode}:`}</span>;
};
