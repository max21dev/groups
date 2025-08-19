import { NDKRelaySet, NostrEvent } from '@nostr-dev-kit/ndk';
import { useNdk } from 'nostr-hooks';
import { useEffect, useMemo, useState } from 'react';

export type RecommendedHandler = {
  platform?: string;
  relayHint?: string;
  aRef: string;
  handlerEvent: NostrEvent | null;
};

export type AppRecommendationData = {
  supportedKind: string | null;
  handlers: RecommendedHandler[];
};

export const useAppRecommendation = (event: NostrEvent) => {
  const [data, setData] = useState<AppRecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const { ndk } = useNdk();

  const supportedKind = useMemo(() => event.tags.find((t) => t[0] === 'd')?.[1] ?? null, [event]);

  const aTags = useMemo(() => {
    return event.tags.filter((t) => t[0] === 'a');
  }, [event]);

  useEffect(() => {
    if (!ndk) {
      setLoading(false);
      return;
    }

    let aborted = false;
    const run = async () => {
      try {
        setLoading(true);
        if (event.kind !== 31989) {
          setErr(`Invalid kind for AppRecommendation: ${event.kind}`);
          setData(null);
          return;
        }

        const jobs = aTags.map(async (tag) => {
          const [_, aRef, relayHint, platform] = tag;
          let handlerEvent: NostrEvent | null = null;

          if (typeof aRef !== 'string') {
            return { platform, relayHint, aRef: '', handlerEvent };
          }

          const [addrKind, appPubkey, dId] = aRef.split(':');
          if (addrKind !== '31990' || !appPubkey || !dId) {
            return { platform, relayHint, aRef, handlerEvent };
          }

          const filter = { kinds: [31990], authors: [appPubkey], '#d': [dId] } as any;

          try {
            const relaySet = NDKRelaySet.fromRelayUrls([relayHint], ndk);
            const ev = await ndk.fetchEvent(filter, relaySet ? { relaySet } : undefined);
            if (ev) handlerEvent = ev.rawEvent();
          } catch {
            /* no-op */
          }

          if (!handlerEvent) {
            try {
              const ev = await ndk.fetchEvent(filter);
              if (ev) handlerEvent = ev.rawEvent();
            } catch {
              /* no-op */
            }
          }

          return { platform, relayHint, aRef, handlerEvent };
        });

        const results = await Promise.all(jobs);
        if (aborted) return;

        setData({
          supportedKind,
          handlers: results.filter(Boolean) as RecommendedHandler[],
        });
        setErr(null);
      } catch (e: any) {
        if (!aborted) {
          setErr(e?.message ?? String(e));
          setData(null);
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    run();
    return () => {
      aborted = true;
    };
  }, [ndk, event, aTags, supportedKind]);

  return { data, loading, error: err };
};
