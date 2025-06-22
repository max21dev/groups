import { NostrEvent } from '@nostr-dev-kit/ndk';

type CommunitySection = {
  name: string;
  kinds: number[];
  fee?: number;
};

export const getCommunityTags = (event: NostrEvent | null) => {
  if (!event)
    return {
      relayTags: [],
      blossomTags: [],
      mintTags: [],
      contentSections: [],
      description: '',
      location: '',
      geohash: '',
    };

  const relayTags = event.tags
    .filter(([tag]: any) => tag.toLowerCase() === 'r')
    .map(([, value]: any) => value);
  const blossomTags = event.tags
    .filter(([tag]: any) => tag.toLowerCase() === 'blossom')
    .map(([, value]: any) => value);
  const mintTags = event.tags
    .filter(([tag]: any) => tag.toLowerCase() === 'mint')
    .map(([, value]: any) => value);

  const description = event.tags.find(([tag]) => tag === 'description')?.[1] || '';
  const location = event.tags.find(([tag]) => tag === 'location')?.[1] || '';
  const geohash = event.tags.find(([tag]) => tag === 'g')?.[1] || '';

  const contentSections: CommunitySection[] = [];
  const tags = event.tags;

  for (let i = 0; i < tags.length; i++) {
    if (tags[i][0] === 'content' && tags[i][1]) {
      const sectionName = tags[i][1];
      const kinds: number[] = [];
      let fee: number | undefined;

      for (let j = i + 1; j < tags.length; j++) {
        if (tags[j][0] === 'content') {
          break;
        }
        if (tags[j][0] === 'k' && tags[j][1]) {
          const kind = parseInt(tags[j][1], 10);
          if (!isNaN(kind)) {
            kinds.push(kind);
          }
        }
        if (tags[j][0] === 'fee' && tags[j][1]) {
          fee = parseInt(tags[j][1], 10);
        }
      }

      if (kinds.length > 0) {
        contentSections.push({
          name: sectionName,
          kinds: kinds,
          fee: fee,
        });
      }
    }
  }

  return {
    relayTags,
    blossomTags,
    mintTags,
    contentSections,
    description,
    location,
    geohash,
  };
};
