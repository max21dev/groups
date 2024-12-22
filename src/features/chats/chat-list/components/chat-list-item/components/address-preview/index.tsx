import { cn } from '@/shared/utils';

import { GroupWidget } from '@/features/groups';
import { UsersList } from '@/features/users';

import { Spinner } from '@/shared/components/spinner';

import { useAddressPreview } from './hooks';

export const AddressPreview = ({
  address,
  sameAsCurrentUser,
}: {
  address: string;
  sameAsCurrentUser: boolean;
}) => {
  const { eventData, category, loading } = useAddressPreview(address);
  console.log(eventData, category, loading);
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center [&_.animate-spin]:h-5 [&_.animate-spin]:w-5">
          <Spinner />
        </div>
      ) : eventData ? (
        <div
          className={cn(
            'rounded-xl overflow-hidden',
            sameAsCurrentUser ? 'bg-blue-700' : 'bg-zinc-200 dark:bg-zinc-700',
          )}
        >
          {category === 'usersList' && <UsersList tags={eventData.tags} />}
          {category === 'group' && <GroupWidget groupId={eventData.tags[0][1]} />}
        </div>
      ) : (
        <p>{address}</p>
      )}
    </>
  );
};
