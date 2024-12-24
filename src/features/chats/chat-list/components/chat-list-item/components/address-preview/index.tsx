import { cn } from '@/shared/utils';

import { Spinner } from '@/shared/components/spinner';

import { GroupWidget } from '@/features/groups';
import { UsersList } from '@/features/users';

import { useAddressPreview } from './hooks';

export const AddressPreview = ({
  address,
  sameAsCurrentUser,
}: {
  address: string;
  sameAsCurrentUser?: boolean;
}) => {
  const { eventData, category } = useAddressPreview(address);

  if (eventData === undefined) {
    return (
      <div className="w-5 h-5">
        <Spinner />
      </div>
    );
  }

  if (eventData === null) {
    return <p className="text-xs">{address}</p>;
  }

  return (
    <>
      <div
        className={cn(
          'rounded-s-xl overflow-hidden',
          sameAsCurrentUser ? 'bg-blue-700' : 'bg-zinc-200 dark:bg-zinc-700',
          category === 'group' && 'rounded-e-xl',
          sameAsCurrentUser !== undefined && 'max-w-80',
        )}
      >
        {category === 'users-list' && (
          <UsersList
            tags={eventData.tags}
            pubkey={eventData?.pubkey}
            createdAt={eventData.created_at}
            address={address}
          />
        )}
        {category === 'group' && <GroupWidget groupId={eventData.tags[0][1]} />}
      </div>
    </>
  );
};
