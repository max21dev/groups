import { CategorizedMessageContent } from '../types';

export const categorizeMessageContent = (content: string): CategorizedMessageContent[] => {
  // Regular expression to match URLs and image URLs
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;

  const parts = content.split(urlRegex).filter((part) => part !== '');

  return parts.map((part) => {
    if (urlRegex.test(part)) {
      if (imageRegex.test(part)) {
        return { category: 'image', content: part };
      } else {
        return { category: 'url', content: part };
      }
    } else {
      return { category: 'text', content: part };
    }
  });
};
