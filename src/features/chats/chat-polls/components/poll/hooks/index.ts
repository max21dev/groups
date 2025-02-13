import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk } from 'nostr-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useChatBottomBar } from '@/features/chats/chat-bottom-bar/hooks';
import { categorizeChatContent } from '@/features/chats/chat-list/components/chat-list-item/utils';
import { usePollsStore } from '@/features/chats/chat-polls/store';

import { useToast } from '@/shared/components/ui/use-toast';
import { useActiveGroup, useActiveRelay } from '@/shared/hooks';

type PollType = 'singlechoice' | 'multiplechoice';

const POLL_KIND = 1018 as NDKKind;
const RESPONSE_TAG = 'response';
const OPTION_TAG = 'option';
const POLL_TYPE_TAG = 'polltype';
const ENDS_AT_TAG = 'endsAt';

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

  const oneVotePerPubkey = (events: Set<NDKEvent>) => {
    const eventMap = new Map<string, NDKEvent>();

    events.forEach((event) => {
      const existingEvent = eventMap.get(event.pubkey);

      if (
        !existingEvent ||
        (event.created_at && event.created_at > (existingEvent.created_at || 0))
      ) {
        eventMap.set(event.pubkey, event);
      }
    });

    return Array.from(eventMap.values());
  };

  const fetchChatPollVotes = useCallback(async () => {
    if (!ndk || !activeRelay || !activeGroupId || !poll.id) return;

    setIsLoadingVotes(true);

    try {
      const voteEvents = await ndk.fetchEvents({
        kinds: [POLL_KIND],
        '#e': [poll.id],
      });

      const filteredVotes = oneVotePerPubkey(voteEvents);

      const voteCounts: Record<string, number> = {};
      const newVoters = new Set<string>();

      filteredVotes.forEach((event) => {
        newVoters.add(event.pubkey);

        event.tags
          .filter(([tag]) => tag === RESPONSE_TAG)
          .forEach(([, optionId]) => {
            voteCounts[optionId] = (voteCounts[optionId] || 0) + 1;
          });
      });

      setVoters(newVoters);
      setVotes(poll.id, voteCounts);
    } catch (error) {
      console.error('Error fetching poll votes:', error);
    } finally {
      setIsLoadingVotes(false);
    }
  }, [ndk, activeRelay, activeGroupId, poll.id, setIsLoadingVotes, setVotes]);

  const options = useMemo(() => {
    return poll.tags
      .filter((tag) => tag[0] === OPTION_TAG)
      .map((tag) => ({
        id: tag[1],
        label: tag[2],
        votes: votes[poll.id]?.[tag[1]] || 0,
      }));
  }, [poll.tags, votes, poll.id]);

  const pollType = useMemo<PollType>(() => {
    const tag = poll.tags.find((t) => t[0] === POLL_TYPE_TAG);
    return (tag?.[1] as PollType) || 'singlechoice';
  }, [poll.tags]);

  const endsAt = useMemo<number | null>(() => {
    const endsAtTag = poll.tags.find((t) => t[0] === ENDS_AT_TAG);
    return endsAtTag ? parseInt(endsAtTag[1], 10) : null;
  }, [poll.tags]);

  const sendVote = useCallback(
    async (selected: string[]) => {
      if (
        !ndk ||
        !activeRelay ||
        !activeGroupId ||
        !poll.id ||
        !selectedOptions.length ||
        !activeUser?.pubkey
      )
        return;

      const responseTags = selected.map((optionId) => [RESPONSE_TAG, optionId]);

      try {
        const voteEvent = new NDKEvent(ndk, {
          kind: POLL_KIND,
          tags: [['h', activeGroupId], ['e', poll.id], ...responseTags],
          created_at: Math.floor(Date.now() / 1000),
          content: '',
          pubkey: activeUser?.pubkey,
        });

        await voteEvent.publish();

        toast({ title: 'Success', description: 'Vote casted successfully', variant: 'default' });
        setSelectedOptions([]);
        fetchChatPollVotes();
      } catch (error) {
        toast({ title: 'Error', description: 'Error casting vote', variant: 'default' });
        console.error('Error casting vote:', error);
      }
    },
    [
      ndk,
      activeRelay,
      activeGroupId,
      poll.id,
      selectedOptions.length,
      activeUser?.pubkey,
      toast,
      fetchChatPollVotes,
    ],
  );

  const totalVotes = useMemo(() => {
    return options.reduce((sum, option) => sum + option.votes, 0);
  }, [options]);

  const canVote = useMemo(() => {
    if (!activeUser) return false;
    if (voters.has(activeUser.pubkey)) return false;
    if (!isMember && !isAdmin) return false;
    if (endsAt && endsAt * 1000 <= Date.now()) return false;
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
    totalVotes,
    canVote,
  };
};
