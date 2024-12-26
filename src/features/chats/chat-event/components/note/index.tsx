export const Note = ({ content }: { content: string }) => {
  return (
    <div className="flex flex-col gap-1 p-2 rounded-md overflow-y-auto max-h-80 [overflow-wrap:anywhere]">
      {content}
    </div>
  );
};