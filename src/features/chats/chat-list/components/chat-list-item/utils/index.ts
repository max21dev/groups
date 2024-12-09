import { parse } from 'nostr-tools/nip21';
import { CategorizedChatContent } from '../types';

// Regular expressions for various content types
const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
const videoRegex = /\.(mp4|mov)$/i;
const youtubeRegex = /https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+$/i;
const nostrMentionRegex = /nostr:npub1[0-9a-z]+/i;

const categorizePart = (part: string): CategorizedChatContent => {
  if (nostrMentionRegex.test(part)) {
    const cleanPart = part.trim().replace(/:$/, '');
    try {
      const parsed = parse(cleanPart);
      if (parsed?.value) {
        return { category: 'mention', content: parsed.value };
      }
    } catch {
      return { category: 'text', content: cleanPart };
    }
  }

  if (urlRegex.test(part)) {
    if (imageRegex.test(part)) {
      return { category: 'image', content: part };
    }
    if (videoRegex.test(part) || youtubeRegex.test(part)) {
      return { category: 'video', content: part };
    }
    return { category: 'url', content: part };
  }

  return { category: 'text', content: part };
};

export const categorizeChatContent = (content: string): CategorizedChatContent[] => {
  const combinedRegex = new RegExp(`(${urlRegex.source})|(${nostrMentionRegex.source})`, 'gi');
  const parts = content.split(combinedRegex).filter((part) => part?.trim() !== '');
  const uniqueParts = Array.from(new Set(parts));

  return uniqueParts.map(categorizePart);
};

export const fetchFirstContentImage = (content: string): string | null => {
  if (!content.trim()) return null;

  const imageRegex = /https?:\/\/[\S]+\.(jpg|jpeg|png|gif|bmp|svg|webp)\b/gi;
  const matches = content.match(imageRegex);

  return matches?.[0] || null;
};
