import { useActiveUser } from 'nostr-hooks';
import { deleteGroupEvent, useGroupThreadComments } from 'nostr-hooks/nip29';
import { useState } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';
import { useActiveGroup, useActiveRelay } from '@/shared/hooks';

export const useChatThreadComments = (parentId: string) => {
  const { activeRelay } = useActiveRelay();
  const { activeGroupId } = useActiveGroup();
  const { activeUser } = useActiveUser();

  const { toast } = useToast();

  const { threadComments, isLoadingThreadComments, hasMoreThreadComments, loadMoreThreadComments } =
    useGroupThreadComments(activeRelay, activeGroupId, {
      byParentId: { parentId, waitForParentId: true },
    });

  const [deletedComments, setDeletedComments] = useState<string[]>([]);

  const deleteThreadComment = async (commentId: string) => {
    if (!activeUser || !activeGroupId || !activeRelay) return;

    deleteGroupEvent({
      relay: activeRelay,
      groupId: activeGroupId,
      eventId: commentId,
      onSuccess: () => {
        setDeletedComments((prev) => [...prev, commentId]);

        toast({
          title: 'Success',
          description: 'Comment deleted successfully',
          variant: 'default',
        });
      },
      onError() {
        toast({
          title: 'Error',
          description: 'Failed to delete comment',
          variant: 'destructive',
        });
      },
    });
  };

  const filteredComments = threadComments?.filter(
    (comment) => !deletedComments.includes(comment.id),
  );

  return {
    threadComments: filteredComments?.length ? filteredComments : undefined,
    isLoadingThreadComments,
    hasMoreThreadComments,
    loadMoreThreadComments,
    deleteThreadComment,
  };
};
