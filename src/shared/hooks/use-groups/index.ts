import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { Group } from '@/shared/types';

const filters = [{ kinds: [39000], limit: 100 }];

export const useGroups = () => {
  const { nip29Ndk } = useNip29Ndk();

  const { events: groupsEvents } = useSubscribe(
    useMemo(() => ({ filters, customNdk: nip29Ndk }), [nip29Ndk]),
  );

  const groups = useMemo(
    () =>
      groupsEvents
        .filter((e) => {
          const nameTag = e.getMatchingTags('name')?.[0];

          return nameTag && nameTag[1] !== '';
        })
        .map(
          (e) =>
            ({
              id: e.dTag,
              name: e.getMatchingTags('name')?.[0]?.[1],
              about: e.getMatchingTags('about')?.[0]?.[1],
              privacy: e.getMatchingTags('public') ? 'public' : 'private',
              type: e.getMatchingTags('open') ? 'open' : 'closed',
              picture: e.getMatchingTags('picture')?.[0]?.[1] || '',
              event: e,
            }) as Group,
        ),
    [groupsEvents],
  );

  return { groups };
};
