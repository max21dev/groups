import { useProfile } from 'nostr-hooks';

export const useGlobalProfile = ({ pubkey }: { pubkey: string | undefined }) => {
  const { profile } = useProfile({ pubkey });

  return { profile };
};
