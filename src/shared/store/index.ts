import NDK, { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { GroupMessage, GroupsFilter } from '../types';

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

type NdkState = {
  globalNdk: NDK;
  nip29Ndk: NDK;
};

type NdkActions = {
  setGlobalNdk: (globalNdk: NDK) => void;
  setNip29Ndk: (nip29Ndk: NDK) => void;
};

type ChatState = {
  replyTo: GroupMessage | undefined;
  isGroupDetailsOpen: boolean;
};

type ChatActions = {
  setReplyTo: (replyTo: GroupMessage | undefined) => void;
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

export const useStore = create<
  AppState &
    AppActions &
    NdkState &
    NdkActions &
    ChatState &
    ChatActions &
    RelaysState &
    RelaysActions &
    GroupsState &
    GroupsActions
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

      // NDK State

      globalNdk: new NDK({
        explicitRelayUrls: ['wss://nos.lol'],
        autoConnectUserRelays: true,
        autoFetchUserMutelist: false,
        cacheAdapter: new NDKCacheAdapterDexie({ dbName: `db-global` }),
      }),

      setGlobalNdk: (globalNdk) => set({ globalNdk }),

      nip29Ndk: new NDK({
        explicitRelayUrls: [],
        autoConnectUserRelays: false,
        autoFetchUserMutelist: false,
        cacheAdapter: undefined,
      }),

      setNip29Ndk: (nip29Ndk) => set({ nip29Ndk }),

      // Chat State

      replyTo: undefined,

      isGroupDetailsOpen: false,

      setReplyTo: (replyTo) => set({ replyTo }),

      toggleGroupDetails: () => set((state) => ({ isGroupDetailsOpen: !state.isGroupDetailsOpen })),

      // Relay State

      relays: [
        { url: 'wss://groups.fiatjaf.com', status: 'DISCONNECTED' },
        { url: 'wss://relay.groups.nip29.com', status: 'DISCONNECTED' },
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

      groupsFilter: { belongTo: true, manage: true, own: true, notJoined: true },
      setGroupsFilter: (groupsFilter) => set({ groupsFilter }),
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
      }),
    },
  ),
);
