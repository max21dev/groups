import { Markdown } from '@/shared/components/markdown';

export const LongFormContent = ({ content }: { content: string }) => {
  return (
    <div className="set-max-h flex flex-col gap-1 p-2 rounded-md overflow-y-auto [overflow-wrap:anywhere]">
      <Markdown content={content} />
    </div>
  );
};
