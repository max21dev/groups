import { GroupWidget } from '@/features/groups';
import { Spinner } from '@/shared/components/spinner';
import { useActiveRelay } from '@/shared/hooks';
import { useAllGroupsMetadataRecords } from 'nostr-hooks/nip29';

export const GroupsListWidget = () => {
  const { activeRelay } = useActiveRelay();

  const { metadataRecords, isLoadingMetadata } = useAllGroupsMetadataRecords(activeRelay);

  if (isLoadingMetadata) return <Spinner />;

  if (Object.keys(metadataRecords).length == 0) return null;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 p-4 overflow-x-auto">
      {Object.keys(metadataRecords).map((groupId) => (
        <GroupWidget key={groupId} groupId={groupId} />
      ))}
    </div>
  );
};
