import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';

import { useStore } from '@/shared/store';

export const useProfile = ({ pubkey }: { pubkey: string | undefined }) => {
  const [profile, setProfile] = useState<NDKUserProfile | null>(null);

  const globalNDK = useStore((state) => state.globalNDK);

  useEffect(() => {
    if (!pubkey) return;

    globalNDK
      .getUser({ pubkey })
      .fetchProfile()
      .then((profile) => {
        setProfile(profile);
      });
  }, [pubkey, globalNDK]);

  return { profile };
};
