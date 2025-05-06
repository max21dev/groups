import { NostrEvent } from '@nostr-dev-kit/ndk';

import { Markdown } from '@/shared/components/markdown';

export const ChatEventObject = ({ event }: { event: NostrEvent }) => {
  const jsonBlock = `\`\`\`json\n${JSON.stringify(event, null, 2)}\n\`\`\``;
  return (
    <div className="set-max-h w-full flex flex-col gap-1 rounded-md overflow-y-auto [overflow-wrap:anywhere]">
      <Markdown content={jsonBlock} className="[&_*]:max-w-full" />
    </div>
  );
};
