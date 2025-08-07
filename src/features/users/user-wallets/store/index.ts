import { NDKCashuWallet } from '@nostr-dev-kit/ndk-wallet';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { NWCClient } from '../lib';
import { CashuTransaction } from '../types';

export type WalletState = {
  // NWC wallets
  walletCodes: string[];
  walletInstances: Record<string, NWCClient | null>;

  // Cashu wallet
  cashuWallet: NDKCashuWallet | null;
  cashuMintList: {
    mints: string[];
    relays: string[];
    pubkey?: string;
  } | null;
  cashuLoading: boolean;
  cashuError: string | null;
  cashuTransactions: CashuTransaction[];
};

export type WalletActions = {
  // NWC actions
  addWallet: (code: string) => void;
  removeWallet: (code: string) => void;
  getWalletInstance: (code: string) => Promise<NWCClient | null>;
  clearWallets: () => void;

  // Cashu actions
  setCashuWallet: (wallet: NDKCashuWallet | null) => void;
  setCashuMintList: (mintList: WalletState['cashuMintList']) => void;
  setCashuLoading: (loading: boolean) => void;
  setCashuError: (error: string | null) => void;
  setCashuTransactions: (transactions: CashuTransaction[]) => void;
  clearCashuWallet: () => void;
};

export const useWalletStore = create<WalletState & WalletActions>()(
  persist(
    (set, get) => ({
      // NWC state
      walletCodes: [],
      walletInstances: {},

      // Cashu state
      cashuWallet: null,
      cashuMintList: null,
      cashuLoading: false,
      cashuError: null,
      cashuTransactions: [],

      // NWC actions
      addWallet: (code: string) => {
        const { walletCodes } = get();
        if (!walletCodes.includes(code)) {
          set({
            walletCodes: [...walletCodes, code],
            walletInstances: { ...get().walletInstances },
          });
        }
      },

      removeWallet: (code: string) => {
        const { walletCodes, walletInstances } = get();
        const newInstances = { ...walletInstances };
        delete newInstances[code];
        set({
          walletCodes: walletCodes.filter((c) => c !== code),
          walletInstances: newInstances,
        });
      },

      getWalletInstance: async (code: string): Promise<NWCClient | null> => {
        const { walletInstances } = get();
        if (walletInstances[code]) {
          return walletInstances[code];
        }
        try {
          const client = new NWCClient(code);
          await client.connect();
          set({
            walletInstances: {
              ...walletInstances,
              [code]: client,
            },
          });
          return client;
        } catch (e) {
          console.error('Failed to create wallet instance:', e);
          return null;
        }
      },

      clearWallets: () => {
        set({
          walletCodes: [],
          walletInstances: {},
        });
      },

      // Cashu actions
      setCashuWallet: (wallet) => set({ cashuWallet: wallet }),
      setCashuMintList: (mintList) => set({ cashuMintList: mintList }),
      setCashuLoading: (loading) => set({ cashuLoading: loading }),
      setCashuError: (error) => set({ cashuError: error }),
      setCashuTransactions: (transactions) => set({ cashuTransactions: transactions }),

      clearCashuWallet: () =>
        set({
          cashuWallet: null,
          cashuMintList: null,
          cashuLoading: false,
          cashuError: null,
          cashuTransactions: [],
        }),
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({ walletCodes: state.walletCodes }),
    },
  ),
);
