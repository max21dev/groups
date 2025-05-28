import { NostrEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { categorizeChatContent } from '@/features/chats/chat-list/components/chat-list-item/utils';

type Contributor = {
  pubkey: string;
  msats: number;
  message: string;
};

export const useZapGoal = (event: NostrEvent) => {
  const [percentage, setPercentage] = useState<number>(0);
  const [contributors, setContributors] = useState<Contributor[]>([]);

  const { ndk } = useNdk();

  const [searchParams] = useSearchParams();
  const isEventPage = !!searchParams.get('eventId');

  const amountTag = event.tags.find((t) => t[0] === 'amount');
  const targetMsats = amountTag ? parseInt(amountTag[1], 10) : 0;

  const summary = event.tags.find((t) => t[0] === 'summary')?.[1] || '';

  const closedAtTag = event.tags.find((t) => t[0] === 'closed_at')?.[1];
  const closedAt = closedAtTag ? parseInt(closedAtTag, 10) : undefined;

  const content = (summary ? `**${summary}**\n\n` : '') + (event.content || '');
  const categorizedChatContent = useMemo(() => categorizeChatContent(content), [content]);

  useEffect(() => {
    if (!ndk || targetMsats <= 0 || !event.id) return;
    loadZaps();
  }, [ndk, event.id, targetMsats]);

  const loadZaps = async () => {
    if (!ndk || !event.id) return;

    const events = await ndk.fetchEvents({
      kinds: [9735],
      '#e': [event.id],
    });

    const zapList = Array.from(events);

    if (zapList.length === 0) {
      setPercentage(0);
      setContributors([]);
      return;
    }

    let totalMsats = 0;
    const list: Contributor[] = zapList.map((ev) => {
      const descTag = ev.tags.find((t) => t[0] === 'description')?.[1];
      let msats = 0;
      let message = ev.content || '';
      let senderPubkey = ev.tags.find((t) => t[0] === 'P')?.[1] || ev.pubkey;

      if (descTag) {
        try {
          const parsed = JSON.parse(descTag);

          const innerAmountTag =
            Array.isArray(parsed.tags) && parsed.tags.find((t: any[]) => t[0] === 'amount');
          if (innerAmountTag) {
            msats = parseInt(innerAmountTag[1], 10);
          }

          if (parsed.content) {
            message = parsed.content;
          }

          if (parsed.pubkey) {
            senderPubkey = parsed.pubkey;
          }
        } catch {
          console.warn("couldn't parse description JSON", descTag);
        }
      }

      totalMsats += msats;
      return {
        pubkey: senderPubkey,
        msats,
        message,
      };
    });

    setContributors(list);
    const pct = Math.min(totalMsats / targetMsats, 1) * 100;
    setPercentage(Math.round(pct));
  };

  return {
    categorizedChatContent,
    targetMsats,
    percentage,
    closedAt,
    isEventPage,
    contributors,
  };
};