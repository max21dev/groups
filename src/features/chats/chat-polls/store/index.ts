import { NDKEvent } from '@nostr-dev-kit/ndk';
import { create } from 'zustand';

type PollState = {
  polls: NDKEvent[];
  votes: Record<string, Record<string, number>>;
  isLoadingPolls: boolean;
  isLoadingVotes: boolean;
  groupId: string | null;
  relay: string | null;
};

type PollActions = {
  setPolls: (polls: NDKEvent[]) => void;
  setVotes: (parentId: string, votes: Record<string, number>) => void;
  setIsLoadingPolls: (loading: boolean) => void;
  setIsLoadingVotes: (loading: boolean) => void;
  resetState: (relay: string | undefined, groupId: string | undefined) => void;
};

export const usePollsStore = create<PollState & PollActions>((set) => ({
  polls: [],
  votes: {},
  isLoadingPolls: false,
  isLoadingVotes: false,
  groupId: null,
  relay: null,

  setPolls: (polls) => set({ polls }),
  setVotes: (parentId, votes) => set((state) => ({ votes: { ...state.votes, [parentId]: votes } })),
  setIsLoadingPolls: (loading) => set({ isLoadingPolls: loading }),
  setIsLoadingVotes: (loading) => set({ isLoadingVotes: loading }),

  resetState: (relay, groupId) => set({ polls: [], votes: {}, relay, groupId }),
}));
