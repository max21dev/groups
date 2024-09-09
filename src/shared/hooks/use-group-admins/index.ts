import { NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';
import { useMemo } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { GroupAdminPermission } from '@/shared/types';

export const useGroupAdmins = (groupId: string | undefined) => {
  const { nip29Ndk } = useNip29Ndk();

  const { events } = useSubscribe(
    useMemo(
      () => ({
        filters: !groupId ? [] : [{ kinds: [39001 as NDKKind], '#d': [groupId], limit: 1 }],
        enabled: !!groupId,
        opts: { groupable: false },
        customNdk: nip29Ndk,
      }),
      [groupId, nip29Ndk],
    ),
  );

  const admins = useMemo(
    () =>
      events && events.length > 0
        ? events[events.length - 1].getMatchingTags('p').map((pTag) => ({
            publicKey: pTag[1],
            permissions: pTag.slice(3) as GroupAdminPermission[],
          }))
        : [],
    [events],
  );

  return { admins };
};
