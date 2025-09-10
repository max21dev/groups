import { Markdown } from '@/shared/components/markdown';

export const LongFormContent = ({ content }: { content: string }) => {
  return (
    <div className="flex flex-col gap-1 p-2 rounded-md [overflow-wrap:anywhere]">
      <Markdown content={content} />
    </div>
  );
};
