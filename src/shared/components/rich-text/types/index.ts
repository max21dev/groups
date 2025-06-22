export type ContentCategory = 'text' | 'image' | 'video' | 'url' | 'mention' | 'event';

export type CategorizedContent = {
  category: ContentCategory;
  content: string;
};
