import { SearchIcon } from 'lucide-react';

import { useAllGroupsMetadataRecords } from 'nostr-hooks/nip29';
import { memo, useMemo, useState } from 'react';

import { GroupsListItem } from '@/features/groups';
import { useHomePage } from '@/pages/home/hooks';

import { Search } from '@/shared/components/search';
import { useSearch } from '@/shared/components/search/hooks';
import { Spinner } from '@/shared/components/spinner';
import { Button } from '@/shared/components/ui/button';
import { useActiveRelay } from '@/shared/hooks';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

export const GroupsList = memo(() => {
  const [lastChatTimestampPerGroup, setLastChatTimestampPerGroup] = useState<
    Record<string, number>
  >({});

  const { activeRelay } = useActiveRelay();

  const { isCollapsed, isMobile } = useHomePage();

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

  if (!sortedGroupIds.length) return null;

  return (
    <>
      {isCollapsed && !isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full" asChild>
            <Button variant="outline" className="p-0 py-2">
              <SearchIcon size={20} className="cursor-pointer" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search Groups"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search Groups" />
      )}

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
});
