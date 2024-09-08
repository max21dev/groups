import { useStore } from '@/shared/store';

export const useNip29Ndk = () => {
  const nip29Ndk = useStore((state) => state.nip29Ndk);
  const setNip29Ndk = useStore((state) => state.setNip29Ndk);

  return { nip29Ndk, setNip29Ndk };
};
