import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';

import { Group } from '@/shared/types';

const filters = [{ kinds: [39000], limit: 100 }];

export const useGroups = () => {
  const { events: groupsEvents } = useSubscribe({ filters });

  const groups = useMemo(
    () =>
      groupsEvents.map((e) => {
        const nameTag = e.getMatchingTags('name')[0];
        const pictureTag = e.getMatchingTags('picture')[0];
        return {
          id: e.dTag,
          name: nameTag ? nameTag[1] : 'Unknown',
          privacy: e.getMatchingTags('public') ? 'public' : 'private',
          type: e.getMatchingTags('open') ? 'open' : 'closed',
          picture: pictureTag ? pictureTag[1] : '',
          event: e,
        } as Group;
      }),
    [groupsEvents],
  );

  return { groups };
};
