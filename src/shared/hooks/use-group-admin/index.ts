import { NDKKind } from '@nostr-dev-kit/ndk';
import { useEffect, useMemo, useState } from 'react';

import { useNip29Ndk } from '@/shared/hooks';
import { GroupAdmin, GroupAdminPermission, GroupAdminPermissionEnum } from '@/shared/types';

export const useGroupAdmin = (groupId: string | undefined, adminPublickey: string | undefined) => {
  const { nip29Ndk } = useNip29Ndk();

  const [admin, setAdmin] = useState<GroupAdmin | undefined>(undefined);

  useEffect(() => {
    if (!groupId || !nip29Ndk || !adminPublickey) return;

    nip29Ndk
      .fetchEvent({ kinds: [39001 as NDKKind], '#d': [groupId], '#p': [adminPublickey] })
      .then((event) => {
        if (!event) return;

        const pTags = event.getMatchingTags('p');

        if (!pTags.length) return;

        const pTag = pTags[0];

        setAdmin({
          publicKey: pTag[1],
          roles: pTag.slice(2) as GroupAdminPermission[],
        });
      });
  }, [groupId, adminPublickey, nip29Ndk]);

  const kingAndCeo = () =>
    admin?.roles.some((item) =>
      [GroupAdminPermissionEnum.king, GroupAdminPermissionEnum.ceo].includes(
        item as GroupAdminPermissionEnum,
      ),
    ) || false;

  return {
    admin,
    canAddUser: useMemo(
      () => admin?.roles.includes(GroupAdminPermissionEnum.king) || false,
      [admin],
    ),
    canRemoveUser: useMemo(
      () => admin?.roles.includes(GroupAdminPermissionEnum.king) || false,
      [admin],
    ),
    canAddPermission: useMemo(kingAndCeo, [admin]),
    canRemovePermission: useMemo(
      () => admin?.roles.includes(GroupAdminPermissionEnum.king) || false,
      [admin],
    ),
    canEditGroupStatus: useMemo(
      () => admin?.roles.includes(GroupAdminPermissionEnum.king) || false,
      [admin],
    ),
    canEditMetadata: useMemo(kingAndCeo, [admin]),
    canDeleteEvent: useMemo(
      () => admin?.roles.includes(GroupAdminPermissionEnum.king) || false,
      [admin],
    ),
    canDeleteGroup: useMemo(
      () => admin?.roles.includes(GroupAdminPermissionEnum.king) || false,
      [admin],
    ),
  };
};
