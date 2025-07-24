import { nip19 } from 'nostr-tools';
import { useParams } from 'react-router-dom';

export type UserRoutingData = {
  isUserProfile: boolean;
  pubkey: string | null;
  npub: string | null;
  nprofile: string | null;
  originalParam: string | null;
  isValid: boolean;
};

export const useUserRouting = (): UserRoutingData => {
  const { user } = useParams();

  if (!user) {
    return {
      isUserProfile: false,
      pubkey: null,
      npub: null,
      nprofile: null,
      originalParam: null,
      isValid: false,
    };
  }

  try {
    const decoded = nip19.decode(user);

    if (decoded.type === 'npub') {
      const pubkey = decoded.data as string;
      return {
        isUserProfile: true,
        pubkey,
        npub: user,
        nprofile: nip19.nprofileEncode({ pubkey }),
        originalParam: user,
        isValid: true,
      };
    }

    if (decoded.type === 'nprofile') {
      const data = decoded.data as { pubkey: string; relays?: string[] };
      const pubkey = data.pubkey;
      return {
        isUserProfile: true,
        pubkey,
        npub: nip19.npubEncode(pubkey),
        nprofile: user,
        originalParam: user,
        isValid: true,
      };
    }

    return {
      isUserProfile: true,
      pubkey: null,
      npub: null,
      nprofile: null,
      originalParam: user,
      isValid: false,
    };
  } catch (error) {
    console.error('Error decoding user parameter:', error);
    return {
      isUserProfile: true,
      pubkey: null,
      npub: null,
      nprofile: null,
      originalParam: user,
      isValid: false,
    };
  }
};
