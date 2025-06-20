import { RichText } from '@/shared/components/rich-text';

export const Note = ({ content }: { content: string }) => {
  return (
    <div className="set-max-h flex flex-col gap-1 p-2 rounded-md overflow-y-auto [overflow-wrap:anywhere]">
      <RichText content={content} />
    </div>
  );
};
