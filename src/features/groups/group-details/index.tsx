import { useGroupDetails } from './hooks';
import { GroupDetailsView } from '@/features/groups/group-details/group-details-view';

export const GroupDetails = ({ groupId }: { groupId: string }) => {
  const { admins, group, members } = useGroupDetails({ groupId });

  return <GroupDetailsView group={group} admins={admins} members={members} />;
};