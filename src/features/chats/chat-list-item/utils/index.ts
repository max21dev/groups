import { CategorizedChatContent } from '../types';

export const categorizeChatContent = (content: string): CategorizedChatContent[] => {
  // Regular expression to match URLs and image URLs
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
  const videoRegex = /\.(mp4|mov)$/i;
  const youtubeRegex = /https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+$/i;

  const parts = content.split(urlRegex).filter((part) => part !== '');

  return parts.map((part) => {
    if (urlRegex.test(part)) {
      if (imageRegex.test(part)) {
        return { category: 'image', content: part };
      } else if (videoRegex.test(part) || youtubeRegex.test(part)) {
        return { category: 'video', content: part };
      } else {
        return { category: 'url', content: part };
      }
    } else {
      return { category: 'text', content: part };
    }
  });
};

export const fetchFirstContentImage = (content: string): string | null => {
  if (content === '') return null;

  const imageRegex = /https?:\/\/[^\s]+?\.(jpg|jpeg|png|gif|bmp|svg|webp)\b/gi;
  const matches = content.match(imageRegex);

  return matches && matches.length > 0 ? matches[0] : null;
};
