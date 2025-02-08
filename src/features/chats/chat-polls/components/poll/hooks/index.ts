import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk } from 'nostr-hooks';
import { useEffect, useMemo, useState } from 'react';

import { useChatBottomBar } from '@/features/chats/chat-bottom-bar/hooks';
import { categorizeChatContent } from '@/features/chats/chat-list/components/chat-list-item/utils';
import { usePollsStore } from '@/features/chats/chat-polls/store';

import { useToast } from '@/shared/components/ui/use-toast';
import { useActiveGroup, useActiveRelay } from '@/shared/hooks';

type PollType = 'singlechoice' | 'multiplechoice';

export const usePoll = (poll: NDKEvent) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [voters, setVoters] = useState<Set<string>>(new Set());

  const { votes, isLoadingVotes, setVotes, setIsLoadingVotes } = usePollsStore();

  const { ndk } = useNdk();
  const { activeGroupId } = useActiveGroup();
  const { activeRelay } = useActiveRelay();
  const { activeUser } = useActiveUser();
  const { isMember, isAdmin } = useChatBottomBar();
  const { toast } = useToast();

  const content = poll.content || '';
  const categorizedChatContent = useMemo(() => categorizeChatContent(content), [content]);

  useEffect(() => {
    fetchChatPollVotes();
  }, [ndk, activeRelay, activeGroupId, poll.id]);

  const fetchChatPollVotes = async () => {
    if (!ndk || !activeRelay || !activeGroupId || !poll.id) return;
    setIsLoadingVotes(true);

    const voteEvents = await ndk.fetchEvents({
      kinds: [1018 as NDKKind],
      '#e': [poll.id],
    });

    const voteCounts: Record<string, number> = {};
    const newVoters = new Set<string>();

    voteEvents.forEach((event) => {
      newVoters.add(event.pubkey);

      event.tags
        .filter((tag) => tag[0] === 'response')
        .forEach((tag) => {
          const optionId = tag[1];
          voteCounts[optionId] = (voteCounts[optionId] || 0) + 1;
        });
    });

    setVoters(newVoters);

    setVotes(poll.id, voteCounts);
    setIsLoadingVotes(false);
  };

  const options = useMemo(() => {
    return poll.tags
      .filter((tag) => tag[0] === 'option')
      .map((tag) => ({
        id: tag[1],
        label: tag[2],
        votes: votes[poll.id]?.[tag[1]] || 0,
      }));
  }, [poll.tags, votes, poll.id]);

  const pollType = useMemo<PollType>(() => {
    const tag = poll.tags.find((t) => t[0] === 'polltype');
    if (!tag) return 'singlechoice';
    return (tag[1] as PollType) || 'singlechoice';
  }, [poll.tags]);

  const endsAt = useMemo<number | null>(() => {
    const endsAtTag = poll.tags.find((t) => t[0] === 'endsAt');
    return endsAtTag ? parseInt(endsAtTag[1], 10) : null;
  }, [poll.tags]);

  const sendVote = async (selected: string[]) => {
    if (!ndk || !activeRelay || !activeGroupId || !poll.id || !selectedOptions.length) return;

    const responseTags =
      selected.length === 1
        ? [['response', selected[0]]]
        : selected.map((optionId) => ['response', optionId]);

    try {
      const voteEvent = new NDKEvent(ndk, {
        kind: 1018,
        tags: [['e', poll.id], ...responseTags],
        created_at: Math.floor(Date.now() / 1000),
        content: '',
        pubkey: activeUser?.pubkey || '',
      });

      await voteEvent.publish();

      toast({ title: 'Success', description: 'Vote casted successfully', variant: 'default' });
      setSelectedOptions([]);
      fetchChatPollVotes();
    } catch (error) {
      toast({ title: 'Error', description: 'Error casting vote', variant: 'default' });
      console.error('Error casting vote:', error);
    }
  };

  const canVote = useMemo(() => {
    if (!activeUser) return false;

    if (voters.has(activeUser.pubkey)) return false;

    if (!isMember && !isAdmin) return false;

    if (endsAt && endsAt * 1000 <= Date.now()) {
      return false;
    }

    return true;
  }, [activeUser, isMember, isAdmin, endsAt, voters]);

  return {
    categorizedChatContent,
    options,
    pollType,
    endsAt,
    selectedOptions,
    isLoadingVotes,
    setSelectedOptions,
    sendVote,
    canVote,
  };
};
