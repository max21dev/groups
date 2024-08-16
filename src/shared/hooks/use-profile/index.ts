import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';

import { useGlobalNdk } from '@/shared/hooks';

export const useProfile = ({ pubkey }: { pubkey: string | undefined }) => {
  const [profile, setProfile] = useState<NDKUserProfile | null>(null);

  const { globalNdk } = useGlobalNdk();

  useEffect(() => {
    if (!pubkey) return;

    globalNdk
      .getUser({ pubkey })
      .fetchProfile()
      .then((profile) => {
        setProfile(profile);
      });
  }, [pubkey, globalNdk]);

  return { profile };
};
