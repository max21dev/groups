import { useAllGroupsMetadataRecords } from 'nostr-hooks/nip29';
import { useMemo, useState } from 'react';

import { Spinner } from '@/shared/components/spinner';

import { GroupsListItem } from '@/features/groups';

import { useActiveRelay } from '@/shared/hooks';

export const GroupsList = () => {
  const [lastChatTimestampPerGroup, setLastChatTimestampPerGroup] = useState<
    Record<string, number>
  >({});

  const { activeRelay } = useActiveRelay();

  const { metadataRecords, isLoadingMetadata } = useAllGroupsMetadataRecords(activeRelay);

  const sortedGroupIds = useMemo(
    () =>
      metadataRecords
        ? Object.keys(metadataRecords).sort(
            (a, b) => lastChatTimestampPerGroup[b] - lastChatTimestampPerGroup[a],
          )
        : [],
    [metadataRecords, lastChatTimestampPerGroup],
  );

  if (isLoadingMetadata) return <Spinner />;

  if (!sortedGroupIds.length) return null;

  return sortedGroupIds.map((groupId) => (
    <GroupsListItem
      key={groupId}
      groupId={groupId}
      setLastChatTimestampPerGroup={setLastChatTimestampPerGroup}
    />
  ));
};
