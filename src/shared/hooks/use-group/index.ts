import { useSubscribe } from 'nostr-hooks';
import { useEffect, useMemo, useState } from 'react';

import { Group } from '@/shared/types';

type Status = 'idle' | 'loading' | 'success';

export const useGroup = (groupId: string | undefined) => {
  const [status, setStatus] = useState<Status>('idle');

  const { events: groupsEvents } = useSubscribe(
    useMemo(
      () => ({
        filters: !groupId ? [] : [{ kinds: [39000], '#d': [groupId] }],
        enabled: !!groupId,
      }),
      [groupId],
    ),
  );

  const group = useMemo(() => {
    if (groupsEvents.length === 0) {
      return undefined;
    }

    const groupEvent = groupsEvents[0];

    const nameTag = groupEvent.getMatchingTags('name')[0];
    const pictureTag = groupEvent.getMatchingTags('picture')[0];

    return {
      id: groupEvent.dTag,
      name: nameTag ? nameTag[1] : 'Unknown',
      privacy: groupEvent.getMatchingTags('public') ? 'public' : 'private',
      type: groupEvent.getMatchingTags('open') ? 'open' : 'closed',
      about: groupEvent.getMatchingTags('about') ? groupEvent.getMatchingTags('about') : '',
      picture: pictureTag ? pictureTag[1] : '',
      event: groupEvent,
    } as Group;
  }, [groupsEvents]);

  useEffect(() => {
    if (groupId && !group) {
      setStatus('loading');
    } else if (groupId && group) {
      setStatus('success');
    } else {
      setStatus('idle');
    }
  }, [groupId, group]);

  return { group, status };
};
