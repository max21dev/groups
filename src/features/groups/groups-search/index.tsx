import { useAllGroupsMetadataRecords } from 'nostr-hooks/nip29';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { GroupAvatar } from '@/features/groups/group-avatar';

import { Search } from '@/shared/components/search';
import { useSearch } from '@/shared/components/search/hooks';
import { Spinner } from '@/shared/components/spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { useActiveRelay } from '@/shared/hooks';
import { ellipsis } from '@/shared/utils';

export const GroupsSearch = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
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

  if (!activeRelay) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        setSearchTerm('');
      }}
    >
      <DialogContent className="sm:max-w-[425px] top-44 h-80 flex flex-col">
        <DialogHeader>
          <DialogTitle className="mt-2">
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search Groups"
            />
          </DialogTitle>
        </DialogHeader>

        {!searchTerm.length ? (
          <p className="text-center text-muted-foreground">
            Search Groups in {activeRelay.replace('wss://', '')}
          </p>
        ) : (
          <>
            {isLoadingMetadata ? (
              <Spinner />
            ) : (
              <div className="overflow-auto flex flex-col justify-start gap-1">
                {filteredData.map((group) => (
                  <Link
                    to={`/?relay=${activeRelay}&groupId=${group.id}`}
                    key={group.id}
                    className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent"
                    onClick={() => {
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <GroupAvatar relay={activeRelay} groupId={group.id} />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold truncate">{ellipsis(group.name, 20)}</p>
                      <p className="text-xs truncate text-muted-foreground">
                        {ellipsis(group.about, 20)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
