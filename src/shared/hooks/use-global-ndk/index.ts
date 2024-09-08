import { useStore } from '@/shared/store';

export const useGlobalNdk = () => {
  const globalNdk = useStore((state) => state.globalNdk);
  const setGlobalNdk = useStore((state) => state.setGlobalNdk);

  return { globalNdk, setGlobalNdk };
};
