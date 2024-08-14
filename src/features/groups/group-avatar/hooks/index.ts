import { useGroup } from '@/shared/hooks/use-group';

export const useGroupAvatar = (groupId: string | undefined) => {
  const { group } = useGroup(groupId);

  return { picture: group?.picture, name: group?.name };
};
