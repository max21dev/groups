import { NDKEvent, NDKRelaySet, NDKSubscriptionCacheUsage } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useRef, useState } from 'react';

import { discoveryRelays } from '@/features/users/user-wallets/configs';

import { BechType, CompatibleApp, RecTarget, WebTag } from '../types';
import { getBechTypeFromNip19, normalizeNip19 } from '../utils';

export function useCompatibleApps(eventId: string, eventKind?: number) {
  const alive = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [apps, setApps] = useState<CompatibleApp[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { ndk } = useNdk();

  useEffect(
    () => () => {
      alive.current = false;
    },
    [],
  );

  useEffect(() => {
    if (!ndk || !eventKind) return;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const kindStr = String(eventKind);

        const initialRelayUrls = new Set<string>();
        (discoveryRelays || []).forEach((r) => initialRelayUrls.add(r));
        const initialRelaySet =
          initialRelayUrls.size > 0
            ? NDKRelaySet.fromRelayUrls([...initialRelayUrls], ndk)
            : undefined;

        const recs = await ndk.fetchEvents(
          { kinds: [31989], '#d': [kindStr] },
          { closeOnEose: true, cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY },
          initialRelaySet,
        );

        const targets: RecTarget[] = [];
        for (const rec of recs) {
          const raw = rec.rawEvent();
          for (const tag of raw.tags) {
            if (tag[0] !== 'a') continue;
            const a = tag[1] || '';
            if (!a.startsWith('31990:')) continue;
            const [, pubkey, d] = a.split(':');
            const relayHint = tag[2];
            const platform = tag[3];
            if (pubkey && d) targets.push({ pubkey, d, relayHint, platform });
          }
        }
        const uniqTargets = Array.from(
          new Map(targets.map((t) => [`${t.pubkey}:${t.d}`, t])).values(),
        );

        const hinted = new Set<string>();
        uniqTargets.forEach((t) => {
          if (t.relayHint) hinted.add(t.relayHint);
        });
        (discoveryRelays || []).forEach((r) => hinted.add(r));
        const finalRelaySet =
          hinted.size > 0 ? NDKRelaySet.fromRelayUrls([...hinted], ndk) : undefined;

        const preciseHandlers = await ndk.fetchEvents(
          {
            kinds: [31990],
            ...(uniqTargets.length > 0
              ? {
                  authors: Array.from(new Set(uniqTargets.map((t) => t.pubkey))),
                  '#d': Array.from(new Set(uniqTargets.map((t) => t.d))),
                }
              : {}),
          },
          { closeOnEose: true, cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY },
          finalRelaySet,
        );

        const directHandlers = await ndk.fetchEvents(
          { kinds: [31990], '#k': [kindStr] },
          { closeOnEose: true, cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY },
          finalRelaySet,
        );

        const handlerMap = new Map<string, NDKEvent>();
        preciseHandlers.forEach((e) => handlerMap.set(e.id, e));
        directHandlers.forEach((e) => handlerMap.set(e.id, e));

        const desiredType = getBechTypeFromNip19(eventId);
        const bestPerApp = new Map<string, CompatibleApp>();

        for (const h of handlerMap.values()) {
          const ev = h.rawEvent();

          const webTags: WebTag[] = ev.tags
            .filter(
              (t: string[]) =>
                t[0] === 'web' && typeof t[1] === 'string' && t[1].includes('<bech32>'),
            )
            .map<WebTag>((t: string[]) => {
              const urlTpl = t[1];
              const t3 = t[2];
              const tagType: BechType | undefined =
                t3 === 'nevent' || t3 === 'naddr' || t3 === 'nprofile'
                  ? (t3 as BechType)
                  : undefined;
              return { urlTpl, tagType };
            });

          if (webTags.length === 0) continue;

          let meta: any = {};
          if (ev.content) {
            try {
              meta = JSON.parse(ev.content);
            } catch {}
          }
          if (!meta?.name) {
            const profile = await ndk.fetchEvents(
              { kinds: [0], authors: [ev.pubkey] },
              { closeOnEose: true, cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY },
              finalRelaySet,
            );
            const first = Array.from(profile)[0];
            if (first?.content) {
              try {
                meta = { ...JSON.parse(first.content), ...meta };
              } catch {}
            }
          }

          const exact: WebTag[] = desiredType
            ? webTags.filter((w: WebTag) => w.tagType === desiredType)
            : [];
          const generic: WebTag[] = webTags.filter((w: WebTag) => !w.tagType);
          const candidates: WebTag[] = exact.length > 0 ? exact : generic;
          if (candidates.length === 0) continue;

          const chosen: WebTag = candidates[0];
          const url = chosen.urlTpl.replace('<bech32>', normalizeNip19(eventId));

          const picked: CompatibleApp = {
            id: `${ev.id}-${chosen.urlTpl}`,
            name: meta?.name || meta?.displayName || 'Unknown App',
            picture: meta?.picture,
            url,
          };

          if (!bestPerApp.has(ev.pubkey)) {
            bestPerApp.set(ev.pubkey, picked);
          }
        }

        const finalList = Array.from(bestPerApp.values());

        if (alive.current) setApps(finalList);
      } catch (e) {
        console.error('useCompatibleAppsV1 error:', e);
        if (alive.current) setError('Failed to load compatible apps');
      } finally {
        if (alive.current) setIsLoading(false);
      }
    })();
  }, [ndk, eventKind, eventId]);

  return { apps, isLoading, error };
}
