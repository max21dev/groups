import { useAllGroupsMetadataRecords } from 'nostr-hooks/nip29';
import { memo, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

import { GroupWidget } from '@/features/groups';
import { Spinner } from '@/shared/components/spinner';
import { useActiveRelay } from '@/shared/hooks';

export const GroupsListWidget = memo(() => {
  const [visibleCount, setVisibleCount] = useState(20);
  const { activeRelay } = useActiveRelay();

  const { metadataRecords, isLoadingMetadata } = useAllGroupsMetadataRecords(activeRelay);

  const groupIds = Object.keys(metadataRecords || {});

  const loadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  if (isLoadingMetadata) return <Spinner />;

  if (!groupIds.length) return null;

  return (
    <div id="scrollableGroupsWidget" className="h-full w-full overflow-auto">
      <InfiniteScroll
        dataLength={visibleCount}
        next={loadMore}
        hasMore={visibleCount < groupIds.length}
        loader={<Spinner />}
        className="w-full grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2 p-4"
        scrollThreshold={'300px'}
        scrollableTarget="scrollableGroupsWidget"
      >
        {groupIds.slice(0, visibleCount).map((groupId) => (
          <GroupWidget key={groupId} groupId={groupId} />
        ))}
      </InfiniteScroll>
    </div>
  );
});
