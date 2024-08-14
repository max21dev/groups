import { useProfile } from '@/shared/hooks';

export const useUserAvatar = ({ pubkey }: { pubkey: string }) => {
  const { profile } = useProfile({ pubkey });

  return { profile };
};
