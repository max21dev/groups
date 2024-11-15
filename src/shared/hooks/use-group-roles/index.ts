import { NDKKind } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { GroupRole } from '@/shared/types';

export const useGroupRoles = (groupId: string | undefined) => {
  const { nip29Ndk } = useNip29Ndk();

  const [roles, setRoles] = useState<GroupRole[] | undefined>(undefined);

  useEffect(() => {
    if (!groupId || !nip29Ndk) return;
    nip29Ndk
      .fetchEvent({ kinds: [39003 as NDKKind], '#d': [groupId]})
      .then((event) => {
        if (!event) return;

        const roleTags = event.getMatchingTags('role');

        if (!roleTags.length) return;

        const roles:GroupRole[] = roleTags.map((roleTag) => ({  name: roleTag[1], description: roleTag[2] }));

        setRoles(roles);
      });
  }, [groupId, nip29Ndk]);
  return { roles };
};
