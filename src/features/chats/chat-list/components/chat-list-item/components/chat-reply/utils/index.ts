export const fetchFirstContentImage = (content: string): string | null => {
  if (!content.trim()) return null;

  const imageRegex = /https?:\/\/[\S]+\.(jpg|jpeg|png|gif|bmp|svg|webp)\b/gi;
  const matches = content.match(imageRegex);

  return matches?.[0] || null;
};
