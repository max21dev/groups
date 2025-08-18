import { NDKEvent, NDKRelaySet, NostrEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useMemo, useState } from 'react';

import { getNostrLink } from '@/shared/utils';

export const useTargetedPublication = (event: NostrEvent) => {
  const [target, setTarget] = useState<NDKEvent | null | undefined>(undefined);

  const { ndk } = useNdk();

  const targetKind = useMemo(() => {
    const k = event.tags.find((t) => t[0] === 'k')?.[1];
    return k ? Number(k) : undefined;
  }, [event.tags]);

  const targetAuthor = useMemo(() => event.tags.find((t) => t[0] === 'p')?.[1], [event.tags]);

  const targetIdentifier = useMemo(() => event.tags.find((t) => t[0] === 'd')?.[1], [event.tags]);

  const eTags = useMemo(() => event.tags.filter((t) => t[0] === 'e'), [event.tags]);

  const selectedETag = useMemo(() => {
    if (eTags.length === 0) return undefined;
    const pub = targetAuthor;
    if (pub) {
      const withPub = eTags.find((t) => t[4] === pub);
      if (withPub) return withPub;
    }
    return eTags[0];
  }, [eTags, targetAuthor]);

  const targetEventId = selectedETag?.[1];

  const relayUrls = useMemo(() => {
    const fromE = eTags.map((t) => t[2]).filter((u): u is string => !!u);
    const fromH = event.tags
      .filter((t) => t[0] === 'h')
      .map((t) => t[2])
      .filter((u): u is string => !!u);
    return Array.from(new Set([...fromE, ...fromH]));
  }, [eTags, event.tags]);

  const relaySet = useMemo(
    () => (ndk && relayUrls.length > 0 ? NDKRelaySet.fromRelayUrls(relayUrls, ndk) : undefined),
    [ndk, relayUrls.join(',')],
  );

  useEffect(() => {
    if (!ndk) return;
    let cancelled = false;

    const run = async () => {
      setTarget(undefined);
      try {
        let found: NDKEvent | undefined;

        if (targetEventId) {
          const s1 = await ndk.fetchEvents(
            { ids: [targetEventId] } as any,
            { closeOnEose: true },
            relaySet,
          );
          found = Array.from(s1)[0];
        }

        if (!found && targetKind && targetAuthor && targetIdentifier) {
          const s2 = await ndk.fetchEvents(
            {
              kinds: [targetKind],
              authors: [targetAuthor],
              '#d': [targetIdentifier],
              limit: 1,
            } as any,
            { closeOnEose: true },
            relaySet,
          );
          found = Array.from(s2)[0];
        }

        if (!found && targetKind && targetEventId) {
          const s3 = await ndk.fetchEvents(
            { kinds: [targetKind], '#e': [targetEventId], limit: 1 } as any,
            { closeOnEose: true },
            relaySet,
          );
          const cand = Array.from(s3)[0];
          if (cand && cand.id === targetEventId) found = cand;
        }

        if (!found && targetKind && targetAuthor) {
          const s4 = await ndk.fetchEvents(
            { kinds: [targetKind], authors: [targetAuthor], limit: 50 } as any,
            { closeOnEose: true },
            relaySet,
          );
          const arr = Array.from(s4);
          if (arr.length > 0) {
            const base = event.created_at || 0;
            arr.sort(
              (a, b) => Math.abs((a.created_at || 0) - base) - Math.abs((b.created_at || 0) - base),
            );
            found = arr[0];
          }
        }

        if (found && found.kind === 30222) {
          found = undefined;
        }

        if (!cancelled) setTarget(found ?? null);
      } catch (e) {
        console.warn('TargetedPublication fetch error:', e);
        if (!cancelled) setTarget(null);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [ndk, relaySet, event.created_at, targetAuthor, targetIdentifier, targetEventId, targetKind]);

  const targetLink =
    (target?.id && getNostrLink(target.id, target.pubkey, target.kind)) || (target?.id as string);

  return {
    target,
    targetLink,
  };
};
