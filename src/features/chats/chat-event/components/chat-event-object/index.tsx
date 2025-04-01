import { NDKEvent } from '@nostr-dev-kit/ndk';

import { Markdown } from '@/shared/components/markdown';

export const ChatEventObject = ({ event }: { event: NDKEvent }) => {
  const jsonBlock = `\`\`\`json\n${JSON.stringify(
    {
      created_at: event.created_at,
      content: event.content,
      tags: event.tags,
      kind: event.kind,
      pubkey: event.pubkey,
      id: event.id,
      sig: event.sig,
    },
    null,
    2,
  )}\n\`\`\``;
  return (
    <div className="set-max-h w-full flex flex-col gap-1 rounded-md overflow-y-auto [overflow-wrap:anywhere]">
      <Markdown content={jsonBlock} className="[&_*]:max-w-full" />
    </div>
  );
};
