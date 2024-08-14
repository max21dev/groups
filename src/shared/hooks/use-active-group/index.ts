import { useStore } from '@/shared/store';

export const useActiveGroup = () => {
  const activeGroupId = useStore((state) => state.activeGroupId);
  const setActiveGroupId = useStore((state) => state.setActiveGroupId);

  return { activeGroupId, setActiveGroupId };
};
