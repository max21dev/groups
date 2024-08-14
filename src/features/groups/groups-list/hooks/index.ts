import { useGroups } from '@/shared/hooks';

export const useGroupsList = () => {
  const { groups } = useGroups();

  return { groups };
};
