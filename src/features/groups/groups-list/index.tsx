import { useAllGroupsMetadataRecords } from 'nostr-hooks/nip29';
import { useMemo, useState } from 'react';

import { Search } from '@/shared/components/search';
import { useSearch } from '@/shared/components/search/hooks';
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

  const groupsListData = Object.keys(metadataRecords).map((id) => ({
    ...metadataRecords[id],
    id,
  }));

  const { searchTerm, setSearchTerm, filteredData } = useSearch({
    data: groupsListData,
    searchKey: (item) => item.name,
  });

  if (isLoadingMetadata) return <Spinner />;

  if (!sortedGroupIds.length) return null;

  return (
    <>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search Groups" />

      {searchTerm === ''
        ? sortedGroupIds.map((groupId) => (
            <GroupsListItem
              key={groupId}
              groupId={groupId}
              setLastChatTimestampPerGroup={setLastChatTimestampPerGroup}
            />
          ))
        : filteredData.map((group) => (
            <GroupsListItem
              key={group.id}
              groupId={group.id}
              setLastChatTimestampPerGroup={setLastChatTimestampPerGroup}
            />
          ))}
    </>
  );
};
