import { useAllGroupsMetadataRecords } from 'nostr-hooks/nip29';
import { memo, useMemo, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

import { GroupsListItem } from '@/features/groups';

import { Spinner } from '@/shared/components/spinner';
import { useActiveRelay } from '@/shared/hooks';

export const GroupsList = memo(() => {
  const [lastChatTimestampPerGroup, setLastChatTimestampPerGroup] = useState<
    Record<string, number>
  >({});
  const [visibleCount, setVisibleCount] = useState(20);

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

  const loadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  if (isLoadingMetadata) return <Spinner />;

  if (!sortedGroupIds.length) return null;

  return (
    <InfiniteScroll
      dataLength={visibleCount}
      next={loadMore}
      hasMore={visibleCount < sortedGroupIds.length}
      loader={<Spinner />}
      className="flex flex-col gap-2"
      scrollThreshold={'300px'}
      scrollableTarget="scrollableGroupsList"
    >
      {sortedGroupIds.slice(0, visibleCount).map((groupId) => (
        <GroupsListItem
          key={groupId}
          groupId={groupId}
          setLastChatTimestampPerGroup={setLastChatTimestampPerGroup}
        />
      ))}
    </InfiniteScroll>
  );
});
