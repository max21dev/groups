import { useGroupMembers } from 'nostr-hooks/nip29';
import { nip19 } from 'nostr-tools';

import { ScrollArea } from '@/shared/components/ui/scroll-area';

import { MentionListItem } from './components';

export const MentionSuggestion = ({
  relay,
  groupId,
  onSelect,
  query,
}: {
  relay: string | undefined;
  groupId: string | undefined;
  onSelect: (mention: string) => void;
  query: string;
}) => {
  const { members } = useGroupMembers(relay, groupId);

  const handleSelect = (pubkey: string) => {
    const npub = nip19.npubEncode(pubkey);
    onSelect(`nostr:${npub}`);
  };

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-0 w-full bg-background border border-border  shadow rounded-md z-10 mb-1">
      <ScrollArea className="max-h-40 overflow-y-auto p-1">
        {members.map((member) => (
          <MentionListItem
            key={member.pubkey}
            pubkey={member.pubkey}
            query={query}
            onClick={handleSelect}
          />
        ))}
      </ScrollArea>
    </div>
  );
};
