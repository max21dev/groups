import { parse } from 'nostr-tools/nip21';
import { CategorizedChatContent } from '../types';

// Regular expressions for various content types
const urlRegex = /https?:\/\/[^\s<>"')\],]+(?=[\s<>"')\],]|$)/gi;
const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg|webp)(\?.*)?$/i;
const videoRegex = /\.(mp4|mov)(\?.*)?$/i;
const youtubeRegex = /https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/i;
const nostrRegex = /nostr:[a-z0-9]+/i;
const mentionRegex = /^npub1[0-9a-z]+$/i;
const noteRegex = /^note1[0-9a-z]+$/i;
const addressRegex = /^naddr1[0-9a-z]+$/i;
const eventRegex = /^nevent1[0-9a-z]+$/i;

const categorizePart = (part: string): CategorizedChatContent => {
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
        if (mentionRegex.test(parsed?.value)) {
          return { category: 'mention', content: parsed.value };
        }
      }
    } catch {
      return { category: 'text', content: part };
    }
  }

  if (imageRegex.test(part)) {
    return { category: 'image', content: part };
  }
  if (videoRegex.test(part) || youtubeRegex.test(part)) {
    return { category: 'video', content: part };
  }
  if (urlRegex.test(part)) {
    return { category: 'url', content: part };
  }

  return { category: 'text', content: part };
};

export const categorizeChatContent = (content: string): CategorizedChatContent[] => {
  const combinedRegex = new RegExp(`(${urlRegex.source})|(${nostrRegex.source})`, 'gi');
  const parts = content.split(combinedRegex).filter((part) => part?.trim() !== '');
  const uniqueParts = Array.from(new Set(parts));

  return uniqueParts.map(categorizePart);
};
