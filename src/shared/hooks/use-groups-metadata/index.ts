import { NDKEvent, NDKFilter, NDKKind, NDKRelaySet } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import type { Nip29GroupMetadata } from 'nostr-hooks/nip29';
import { useCallback, useEffect, useMemo, useState } from 'react';

type GroupsMetadata = {
  metadataRecords: Record<string, Nip29GroupMetadata>;
  metadataEvents: NDKEvent[] | undefined;
  isLoadingMetadata: boolean;
};

export const useGroupsMetadata = (relay: string | undefined): GroupsMetadata => {
  const [events, setEvents] = useState<NDKEvent[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { ndk } = useNdk();

  const relaySet = useMemo(() => {
    if (!ndk || !relay) return undefined;
    return NDKRelaySet.fromRelayUrls([relay], ndk);
  }, [ndk, relay]);

  const parseMetadata = useCallback(
    (
      ev: NDKEvent,
    ): {
      groupId?: string;
      meta: Nip29GroupMetadata;
    } => {
      const dTag = (ev as any).dTag ?? ev.getMatchingTags?.('d')?.[0]?.[1];

      const name = ev.getMatchingTags?.('name')?.[0]?.[1] || '<unnamed>';
      const picture = ev.getMatchingTags?.('picture')?.[0]?.[1] || '';
      const about = ev.getMatchingTags?.('about')?.[0]?.[1] || '';
      const isOpen = (ev.getMatchingTags?.('open')?.length ?? 0) > 0;
      const isPublic = (ev.getMatchingTags?.('public')?.length ?? 0) > 0;

      return {
        groupId: dTag,
        meta: { name, picture, about, isOpen, isPublic },
      };
    },
    [],
  );

  useEffect(() => {
    if (!ndk || !relaySet) {
      setEvents(undefined);
      return;
    }

    let aborted = false;

    const run = async () => {
      setIsLoading(true);
      try {
        const filter: NDKFilter = { kinds: [NDKKind.GroupMetadata] };

        const res = await ndk.fetchEvents(filter, { closeOnEose: true }, relaySet);
        if (aborted) return;

        const sorted = Array.from(res).sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));

        const byId = new Map<string, NDKEvent>();
        for (const e of sorted) if (!byId.has(e.id)) byId.set(e.id, e);

        setEvents(Array.from(byId.values()));
      } catch (e) {
        console.error('useGroupsMetadata fetch error:', e);
        setEvents([]);
      } finally {
        if (!aborted) setIsLoading(false);
      }
    };

    run();
    return () => {
      aborted = true;
    };
  }, [ndk, relaySet]);

  const metadataRecords = useMemo(() => {
    const recs: Record<string, Nip29GroupMetadata> = {};
    if (!events || events.length === 0) return recs;

    const latestByGroup = new Map<string, NDKEvent>();
    for (const ev of events) {
      const { groupId } = parseMetadata(ev);
      if (!groupId) continue;
      const prev = latestByGroup.get(groupId);
      if (!prev || (ev.created_at ?? 0) > (prev.created_at ?? 0)) {
        latestByGroup.set(groupId, ev);
      }
    }

    for (const [gid, ev] of latestByGroup.entries()) {
      recs[gid] = parseMetadata(ev).meta;
    }
    return recs;
  }, [events, parseMetadata]);

  return {
    metadataRecords,
    metadataEvents: events,
    isLoadingMetadata: isLoading,
  };
};
