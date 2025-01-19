import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk } from 'nostr-hooks';
import { useEffect } from 'react';

import { useToast } from '@/shared/components/ui/use-toast';
import { useActiveRelay } from '@/shared/hooks';
import { useStore } from '@/shared/store';

export const useGroupBookmark = (groupId: string | undefined, groupName?: string) => {
  const { bookmarkedGroups, addBookmarkedGroup, removeBookmarkedGroup, setBookmarkedGroups } =
    useStore();
  const groupsFilter = useStore((state) => state.groupsFilter);
  const setGroupsFilter = useStore((state) => state.setGroupsFilter);

  const { activeUser } = useActiveUser();
  const { activeRelay } = useActiveRelay();
  const { ndk } = useNdk();

  const { toast } = useToast();

  const isBookmarked = groupId ? bookmarkedGroups.some((group) => group.id === groupId) : false;

  useEffect(() => {
    if (ndk && activeUser && activeRelay) {
      fetchBookmarkedGroups();
    }
  }, [ndk, activeUser]);

  const fetchBookmarkedGroups = async () => {
    if (!ndk || !activeUser || !activeRelay) return;

    const events = await ndk.fetchEvents({
      kinds: [NDKKind.SimpleGroupList],
      authors: [activeUser.pubkey],
    });

    const groups = Array.from(events).flatMap((event) =>
      event.tags
        .filter((tag) => tag[0] === 'group')
        .map((tag) => ({ id: tag[1], relay: tag[2], name: tag[3] || '' })),
    );

    setBookmarkedGroups(groups);
  };

  const updateBookmarks = async (updateFn: (tags: string[][]) => string[][]) => {
    if (!ndk || !activeUser || !activeRelay) return;

    const events = await ndk.fetchEvents({
      kinds: [NDKKind.SimpleGroupList],
      authors: [activeUser.pubkey],
    });

    const currentEvent = Array.from(events)[0];
    const currentTags = currentEvent ? currentEvent.tags : [];

    const updatedTags = updateFn(currentTags);

    if (JSON.stringify(currentTags) === JSON.stringify(updatedTags)) return;

    const updatedEvent = new NDKEvent(ndk, {
      kind: NDKKind.SimpleGroupList,
      tags: updatedTags,
      created_at: Math.floor(Date.now() / 1000),
      pubkey: activeUser.pubkey,
      content: '',
    });

    try {
      await updatedEvent.publish();
      toast({
        title: 'Success',
        description: 'Bookmarks updated successfully.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update bookmarks.',
        variant: 'destructive',
      });
      console.error('Error publishing updated event:', error);
    }

    const updatedGroups = updatedTags.map((tag) => ({
      id: tag[1],
      relay: tag[2],
      name: tag[3] || '',
    }));
    setBookmarkedGroups(updatedGroups);
    setGroupsFilter({ ...groupsFilter });
  };

  const addGroupToBookmarks = async () => {
    if (!groupId) return;

    await updateBookmarks((currentTags) => {
      const isAlreadyBookmarked = currentTags.some(
        (tag) => tag[0] === 'group' && tag[1] === groupId,
      );
      if (isAlreadyBookmarked) {
        toast({
          title: 'Notice',
          description: 'Group is already bookmarked.',
          variant: 'default',
        });
        return currentTags;
      }

      const newTag = ['group', groupId, activeRelay || '', groupName || ''];
      addBookmarkedGroup({ id: groupId, relay: activeRelay || '', name: groupName || '' });
      return [...currentTags, newTag];
    });
  };

  const removeGroupFromBookmarks = async () => {
    if (!groupId) return;

    await updateBookmarks((currentTags) => {
      removeBookmarkedGroup(groupId);
      return currentTags.filter((tag) => !(tag[0] === 'group' && tag[1] === groupId));
    });
  };

  return {
    bookmarkedGroups,
    isBookmarked,
    addGroupToBookmarks,
    removeGroupFromBookmarks,
    activeUser,
  };
};
