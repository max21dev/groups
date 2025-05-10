import { NostrEvent } from '@nostr-dev-kit/ndk';
import { useNdk, useProfile } from 'nostr-hooks';
import { useEffect, useState } from 'react';

interface AppMetadata {
  name?: string;
  displayName?: string;
  picture?: string;
  banner?: string;
  about?: string;
  website?: string;
  nip05?: string;
}

interface AppRecommendationData {
  metadata: AppMetadata;
  supportedKinds: string[];
  platforms: Record<string, string[]>;
  categories: string[];
  sourceUrl?: string;
}

export const useAppRecommendation = (event: NostrEvent) => {
  const { ndk } = useNdk();
  const [appData, setAppData] = useState<AppRecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { profile } = useProfile({ pubkey: event.pubkey });

  useEffect(() => {
    const processEvent = async () => {
      try {
        setIsLoading(true);

        if (event.kind === 31990) {
          await processKind31990(event);
        } else if (event.kind === 31989) {
          await processKind31989(event);
        } else {
          setError(`Unsupported event kind: ${event.kind}`);
        }
      } catch (err) {
        console.error('Error processing app recommendation:', err);
        setError(
          `Failed to process app recommendation: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setIsLoading(false);
      }
    };

    processEvent();
  }, [event, ndk]);

  const processKind31990 = async (event: NostrEvent) => {
    let metadata: AppMetadata = {};
    const supportedKinds: string[] = [];
    const platforms: Record<string, string[]> = {};
    const categories: string[] = [];
    let sourceUrl: string | undefined;

    event.tags
      .filter((tag) => tag[0] === 'k')
      .forEach((tag) => {
        if (tag[1]) supportedKinds.push(tag[1]);
      });

    event.tags.forEach((tag) => {
      const platform = tag[0];
      if (!['d', 'k', 't', 'r', 'published_at', 'alt'].includes(platform)) {
        if (!platforms[platform]) platforms[platform] = [];
        platforms[platform].push(tag[1]);
      }
    });

    event.tags
      .filter((tag) => tag[0] === 't')
      .forEach((tag) => {
        if (tag[1]) categories.push(tag[1]);
      });

    const sourceTag = event.tags.find(
      (tag) => tag[0] === 'r' && tag.length >= 3 && tag[2] === 'source',
    );
    if (sourceTag && sourceTag[1]) {
      sourceUrl = sourceTag[1];
    }

    if (event.content && event.content.trim() !== '') {
      try {
        metadata = JSON.parse(event.content);
      } catch (e) {
        console.warn('Failed to parse app metadata from content:', e);
      }
    } else if (profile) {
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

    setAppData({
      metadata,
      supportedKinds,
      platforms,
      categories,
      sourceUrl,
    });
  };

  const processKind31989 = async (event: NostrEvent) => {
    const supportedKind = event.tags.find((tag) => tag[0] === 'd')?.[1] || '';
    const supportedKinds = supportedKind ? [supportedKind] : [];

    const platforms: Record<string, string[]> = {};

    event.tags
      .filter((tag) => tag[0] === 'a')
      .forEach((tag) => {
        if (tag.length >= 4) {
          const [_, appReference, , platform] = tag; // Omit 'relay'
          if (platform) {
            if (!platforms[platform]) platforms[platform] = [];
            platforms[platform].push(appReference);
          }
        }
      });

    setAppData({
      metadata: {
        name: profile?.name,
        displayName: profile?.displayName,
        picture: profile?.picture?.toString(),
      },
      supportedKinds,
      platforms,
      categories: [],
    });
  };

  return { appData, isLoading, error, profile };
};
