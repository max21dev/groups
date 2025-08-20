import { NostrEvent } from '@nostr-dev-kit/ndk';
import { useProfile } from 'nostr-hooks';
import { useEffect, useState } from 'react';

type AppMetadata = {
  name?: string;
  displayName?: string;
  picture?: string;
  banner?: string;
  about?: string;
  website?: string;
  nip05?: string;
};

export type AppHandlerData = {
  metadata: AppMetadata;
  supportedKinds: string[];
  platforms: Record<string, { url: string; nip19?: string }[]>;
  categories: string[];
  sourceUrl?: string;
};

export const useAppHandler = (event: NostrEvent) => {
  const [data, setData] = useState<AppHandlerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const { profile } = useProfile({ pubkey: event.pubkey });

  useEffect(() => {
    try {
      setLoading(true);

      if (event.kind !== 31990) {
        setErr(`Invalid kind for AppHandler: ${event.kind}`);
        setData(null);
        return;
      }

      const supportedKinds: string[] = [];
      const platforms: AppHandlerData['platforms'] = {};
      const categories: string[] = [];
      let sourceUrl: string | undefined;

      event.tags.filter((t) => t[0] === 'k').forEach((t) => t[1] && supportedKinds.push(t[1]));

      event.tags.forEach((t) => {
        const platform = t[0];
        if (!['d', 'k', 't', 'r', 'published_at', 'alt'].includes(platform)) {
          if (!platforms[platform]) platforms[platform] = [];
          platforms[platform].push({ url: t[1], nip19: t[2] });
        }
      });

      event.tags.filter((t) => t[0] === 't').forEach((t) => t[1] && categories.push(t[1]));

      const rSource = event.tags.find((t) => t[0] === 'r' && t[2] === 'source');
      if (rSource?.[1]) sourceUrl = rSource[1];

      let metadata: AppMetadata = {};
      if (event.content?.trim()) {
        try {
          metadata = JSON.parse(event.content);
        } catch (e) {}
      }
      if (!Object.keys(metadata).length && profile) {
        metadata = {
          name: profile.name,
          displayName: profile.displayName,
          picture: profile.picture?.toString(),
          banner: profile.banner,
          about: profile.about,
          website: profile.website,
          nip05: profile.nip05,
        };
      }

      setData({ metadata, supportedKinds, platforms, categories, sourceUrl });
      setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [event, profile]);

  return { data, loading, error: err };
};
