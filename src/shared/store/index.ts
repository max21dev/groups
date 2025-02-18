import { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { GroupsFilter } from '../types';

type AppState = {
  sidebarWidth: number;

  isCollapsed: boolean;

  hasCustomSidebarWidth: boolean;

  isLoginModalOpen: boolean;

  isZapModalOpen: boolean;

  zapTarget: NDKEvent | NDKUser | undefined;
};

type AppActions = {
  setSidebarWidth: (sidebarWidth: number) => void;

  setIsCollapsed: (isCollapsed: boolean) => void;

  setHasCustomSidebarWidth: (hasCustomSidebarWidth: boolean) => void;

  setIsLoginModalOpen: (isOpen: boolean) => void;

  setIsZapModalOpen: (isOpen: boolean) => void;

  setZapTarget: (target: NDKEvent | NDKUser | undefined) => void;
};

type ChatState = {
  replyTo: string | undefined;
  isGroupDetailsOpen: boolean;
};

type ChatActions = {
  setReplyTo: (replyTo: string | undefined) => void;
  toggleGroupDetails: () => void;
};

type GroupsState = {
  groupsFilter: GroupsFilter | undefined;
};

type GroupsActions = {
  setGroupsFilter: (groupsFilter: GroupsFilter | undefined) => void;
};

type RelaysState = {
  relays: { url: string; status: string }[];
};

type RelaysActions = {
  addRelay: (relay: string) => void;
  safeRemoveRelay: (relay: string) => void;
  setRelayStatus: (relay: string, status: string) => void;
};

type BookmarkState = {
  bookmarkedGroups: { id: string; relay: string; name?: string }[];
};

type BookmarkActions = {
  setBookmarkedGroups: (groups: { id: string; relay: string; name?: string }[]) => void;
  addBookmarkedGroup: (group: { id: string; relay: string; name?: string }) => void;
  removeBookmarkedGroup: (groupId: string) => void;
};

type NotificationSettings = {
  not_joined_groups: boolean;
  admin_groups: boolean;
  member_groups: boolean;
  notif_exceptions: Map<string, Map<string, boolean>>;
  last_seen_groups: Map<string, Map<string, number>>;
  created_at: number;
};

type UserSettingsState = {
  userSettings: NotificationSettings;
};

type UserSettingsActions = {
  setUserSettings: (settings: NotificationSettings) => void;
};

export const useStore = create<
  AppState &
    AppActions &
    ChatState &
    ChatActions &
    RelaysState &
    RelaysActions &
    GroupsState &
    GroupsActions &
    BookmarkState &
    BookmarkActions &
    UserSettingsState &
    UserSettingsActions
>()(
  persist(
    (set, get) => ({
      // App State

      sidebarWidth: 80,

      isCollapsed: true,

      hasCustomSidebarWidth: false,

      isLoginModalOpen: false,

      isZapModalOpen: false,

      zapTarget: undefined,

      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),

      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),

      setHasCustomSidebarWidth: (hasCustomSidebarWidth) => set({ hasCustomSidebarWidth }),

      setIsLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),

      setIsZapModalOpen: (isOpen) => set({ isZapModalOpen: isOpen }),

      setZapTarget: (target) => set({ zapTarget: target }),

      // Chat State

      replyTo: undefined,

      isGroupDetailsOpen: false,

      setReplyTo: (replyTo) => set({ replyTo }),

      toggleGroupDetails: () => set((state) => ({ isGroupDetailsOpen: !state.isGroupDetailsOpen })),

      // Relay State

      relays: [
        { url: 'wss://groups.fiatjaf.com', status: 'DISCONNECTED' },
        { url: 'wss://relay.groups.nip29.com', status: 'DISCONNECTED' },
        { url: 'wss://groups.0xchat.com', status: 'DISCONNECTED' },
      ],

      addRelay: (relay) => {
        relay = relay.trim();
        const { relays } = get();
        // Check if the relay URL already exists before adding
        if (!relays.some((r) => r.url === relay)) {
          set({ relays: [...relays, { url: relay, status: 'DISCONNECTED' }] });
        }
      },

      safeRemoveRelay: (relay) => {
        const { relays } = get();

        if (relays.length === 1) {
          return;
        }

        set({
          relays: relays.filter((r) => r.url !== relay),
        });
      },

      setRelayStatus: (relay, status) => {
        const { relays } = get();
        set({
          relays: relays.map((r) => (r.url === relay ? { ...r, status } : r)),
        });
      },

      groupsFilter: { belongTo: true, manage: true, own: true, notJoined: true, bookmarked: true },
      setGroupsFilter: (groupsFilter) => set({ groupsFilter }),

      // Bookmark State

      bookmarkedGroups: [],

      setBookmarkedGroups: (groups) => set({ bookmarkedGroups: groups }),

      addBookmarkedGroup: (group) => {
        const { bookmarkedGroups } = get();
        if (!bookmarkedGroups.some((g) => g.id === group.id)) {
          set({ bookmarkedGroups: [...bookmarkedGroups, group] });
        }
      },

      removeBookmarkedGroup: (groupId) => {
        const { bookmarkedGroups } = get();
        set({
          bookmarkedGroups: bookmarkedGroups.filter((group) => group.id !== groupId),
        });
      },

      // User Settings State

      userSettings: {
        not_joined_groups: true,
        admin_groups: true,
        member_groups: true,
        notif_exceptions: new Map<string, Map<string, boolean>>(),
        last_seen_groups: new Map<string, Map<string, number>>(),
        created_at: Math.floor(Date.now() / 1000),
      },

      setUserSettings: (settings) => set({ userSettings: settings }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        relays: state.relays
          .filter((relay) => relay && typeof relay?.url === 'string') // Skip problematic objects
          .filter(
            (relay, index, self) => index === self.findIndex((r) => r.url === relay.url), // Ensure unique URLs
          ),
        sidebarWidth: state.sidebarWidth,
        isCollapsed: state.isCollapsed,
        hasCustomSidebarWidth: state.hasCustomSidebarWidth,
        bookmarkedGroups: state.bookmarkedGroups,
      }),
    },
  ),
);
