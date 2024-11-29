import { useGroupMetadata } from 'nostr-hooks/nip29';

export const useGroupAvatar = (relay: string | undefined, groupId: string | undefined) => {
  const { metadata, isLoadingMetadata } = useGroupMetadata(relay, groupId);

  return {
    picture: metadata?.picture,
    name: metadata?.name,
    isLoadingGroupAvatar: isLoadingMetadata,
  };
};
