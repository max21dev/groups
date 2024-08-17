import NDK, { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { GroupMessage } from '../types';

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

type GlobalNDKState = {
  globalNDK: NDK;
};

type GlobalNDKActions = {
  setGlobalNDK: (globalNDK: NDK) => void;
};

type ChatState = {
  activeGroupId: string | undefined;
  replyTo: GroupMessage | undefined;
  isGroupDetailsOpen: boolean;
};

type ChatActions = {
  setActiveGroupId: (activeGroupId: string | undefined) => void;
  setReplyTo: (replyTo: GroupMessage | undefined) => void;
  toggleGroupDetails: () => void;
};

type RelaysState = {
  relays: string[];
  activeRelayIndex: number;
};

type RelaysActions = {
  addRelay: (relay: string) => void;
  safeRemoveRelay: (relay: string) => void;
  setActiveRelayIndex: (activeRelayIndex: number) => void;
};

export const useStore = create<
  AppState &
    AppActions &
    GlobalNDKState &
    GlobalNDKActions &
    ChatState &
    ChatActions &
    RelaysState &
    RelaysActions
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

      // Global NDK State

      globalNDK: new NDK({
        explicitRelayUrls: ['wss://nos.lol'],
        autoConnectUserRelays: false,
        autoFetchUserMutelist: false,
      }),

      setGlobalNDK: (globalNDK) => set({ globalNDK }),

      // Chat State

      activeGroupId: undefined,

      replyTo: undefined,

      isGroupDetailsOpen: false,

      setActiveGroupId: (activeGroupId) => set({ activeGroupId }),

      setReplyTo: (replyTo) => set({ replyTo }),

      toggleGroupDetails: () => set((state) => ({ isGroupDetailsOpen: !state.isGroupDetailsOpen })),

      // Relay State

      relays: ['wss://groups.fiatjaf.com'],

      activeRelayIndex: 0,

      addRelay: (relay) => {
        const { relays } = get();

        if (!relays.includes(relay)) {
          set({ relays: [...relays, relay] });
        }
      },

      safeRemoveRelay: (relay) => {
        const { relays } = get();

        if (relays.length === 1) {
          return;
        }

        set({
          activeRelayIndex: 0,
          relays: relays.filter((r) => r !== relay),
        });
      },

      setActiveRelayIndex: (activeRelayIndex) => set({ activeRelayIndex }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        activeRelayIndex: state.activeRelayIndex,
        relays: state.relays,
        sidebarWidth: state.sidebarWidth,
        isCollapsed: state.isCollapsed,
        hasCustomSidebarWidth: state.hasCustomSidebarWidth,
      }),
    },
  ),
);
