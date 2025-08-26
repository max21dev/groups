import { RichText } from '@/shared/components/rich-text';

export const Note = ({ content }: { content: string }) => {
  return (
    <div className="flex flex-col gap-1 p-2 rounded-md [overflow-wrap:anywhere]">
      <RichText content={content} />
    </div>
  );
};
