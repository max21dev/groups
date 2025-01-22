import { sendGroupThreadComment } from 'nostr-hooks/nip29';

import { useToast } from '@/shared/components/ui/use-toast';
import { useSendContent } from '@/shared/hooks';

export const useSendThreadComment = (rootId: string) => {
  const { toast } = useToast();

  return useSendContent((relay, groupId, content) => {
    sendGroupThreadComment({
      relay,
      groupId,
      threadComment: { content, rootId },
      onError: () =>
        toast({ title: 'Error', description: 'Failed to send comment', variant: 'destructive' }),
    });
  });
};
