import { sendGroupThread } from 'nostr-hooks/nip29';

import { useToast } from '@/shared/components/ui/use-toast';
import { useSendContent } from '@/shared/hooks';

export const useSendChatThread = (onAfterSend?: () => void) => {
  const { toast } = useToast();

  return useSendContent((relay, groupId, content) => {
    sendGroupThread({
      relay,
      groupId,
      thread: { content, subject: '' },
      onError: () =>
        toast({ title: 'Error', description: 'Failed to send thread', variant: 'destructive' }),
    });
  }, onAfterSend);
};
