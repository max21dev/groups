import { parse } from 'nostr-tools/nip21';

import { CategorizedContent } from '../types';

// Regular expressions for various content types
const urlRegex = /https?:\/\/[^\s<>"')\],]+(?=[\s<>"')\],]|$)/gi;
const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg|webp)(\?.*)?$/i;
const videoRegex = /\.(mp4|mov)(\?.*)?$/i;
const youtubeRegex = /https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/i;
const nostrRegex = /nostr:[a-z0-9]+/i;
const mentionRegex = /^npub1[0-9a-z]+$/i;
const profileRegex = /^nprofile1[0-9a-z]+$/i;
const noteRegex = /^note1[0-9a-z]+$/i;
const addressRegex = /^naddr1[0-9a-z]+$/i;
const eventRegex = /^nevent1[0-9a-z]+$/i;
const emojiInlineRegex = /:([\w+-]+):/g;
const emojiFullRegex = /^:([\w+-]+):$/;
const singleEmojiMessageRegex = /^\s*:([\w+-]+):\s*$/;

const toEmojiImageMarkdown = (raw: string, title?: string) => {
  const m = raw.match(emojiFullRegex);
  if (!m) return raw;
  const shortcode = m[1];
  const encoded = encodeURIComponent(shortcode);
  const titlePart = title ? ` "${title}"` : '';
  return `![${raw}](/emoji/${encoded}${titlePart})`;
};

const categorizePart = (part: string): CategorizedContent => {
  if (nostrRegex.test(part)) {
    const cleanPart = part.trim().replace(/:$/, '');
    try {
      const parsed = parse(cleanPart);
      if (parsed?.value) {
        if (
          noteRegex.test(parsed?.value) ||
          addressRegex.test(parsed?.value) ||
          eventRegex.test(parsed?.value)
        ) {
          return { category: 'event', content: parsed.value };
        }
        if (mentionRegex.test(parsed?.value) || profileRegex.test(parsed?.value)) {
          const id = parsed.value;
          return {
            category: 'text',
            content: `[@${id}](/user/${id})`,
          };
        }
      }
    } catch {
      return { category: 'text', content: part };
    }
  }

  if (emojiFullRegex.test(part)) {
    return { category: 'text', content: toEmojiImageMarkdown(part) };
  }
  if (imageRegex.test(part)) {
    return { category: 'image', content: part };
  }
  if (videoRegex.test(part) || youtubeRegex.test(part)) {
    return { category: 'video', content: part };
  }
  if (urlRegex.test(part)) {
    return {
      category: 'text',
      content: `[${part}](${part})`,
    };
  }

  return { category: 'text', content: part };
};

export const categorizeContent = (content: string): CategorizedContent[] => {
  if (singleEmojiMessageRegex.test(content)) {
    const only = content.trim().match(emojiFullRegex)![0];
    return [{ category: 'text', content: toEmojiImageMarkdown(only, 'big') }];
  }

  const regex = new RegExp(
    `(${urlRegex.source})|(${nostrRegex.source})|(${emojiInlineRegex.source})`,
    'gi',
  );

  const tokens: string[] = [];
  let lastIndex = 0;

  for (const m of content.matchAll(regex)) {
    const idx = m.index!;
    if (idx > lastIndex) {
      tokens.push(content.slice(lastIndex, idx));
    }
    tokens.push(m[0]);
    lastIndex = idx + m[0].length;
  }
  if (lastIndex < content.length) {
    tokens.push(content.slice(lastIndex));
  }

  return tokens.map(categorizePart);
};
