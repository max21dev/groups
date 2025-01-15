import { useAllGroupsMetadataRecords } from 'nostr-hooks/nip29';
import { memo, useMemo } from 'react';

import { GroupWidget } from '@/features/groups';
import { Spinner } from '@/shared/components/spinner';
import { useActiveRelay } from '@/shared/hooks';

import { Search } from '@/shared/components/search';
import { useSearch } from '@/shared/components/search/hooks';

export const GroupsListWidget = memo(() => {
  const { activeRelay } = useActiveRelay();

  const { metadataRecords, isLoadingMetadata } = useAllGroupsMetadataRecords(activeRelay);

  const groupsListData = useMemo(
    () =>
      Object.keys(metadataRecords).map((id) => ({
        ...metadataRecords[id],
        id,
      })),
    [metadataRecords],
  );

  const { searchTerm, setSearchTerm, filteredData } = useSearch({
    data: groupsListData,
    searchKey: (item) => item.name,
  });

  if (isLoadingMetadata) return <Spinner />;

  if (Object.keys(metadataRecords).length == 0) return null;

  return (
    <>
      <div className="w-2/3 p-4 mt-0">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search Groups" />
      </div>
      <div className="w-full grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2 p-4 overflow-x-auto mb-auto">
        {searchTerm === ''
          ? Object.keys(metadataRecords).map((groupId) => (
              <GroupWidget key={groupId} groupId={groupId} />
            ))
          : filteredData.map((group) => <GroupWidget key={group.id} groupId={group.id} />)}
      </div>
    </>
  );
});
