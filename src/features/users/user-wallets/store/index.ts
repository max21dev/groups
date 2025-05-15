import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { NWCClient } from '../lib';

export type WalletState = {
  walletCodes: string[];
  walletInstances: Record<string, NWCClient | null>;
};

export type WalletActions = {
  addWallet: (code: string) => void;
  removeWallet: (code: string) => void;
  getWalletInstance: (code: string) => Promise<NWCClient | null>;
  clearWallets: () => void;
};

export const useWalletStore = create<WalletState & WalletActions>()(
  persist(
    (set, get) => ({
      walletCodes: [],
      walletInstances: {},

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
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({ walletCodes: state.walletCodes }),
    },
  ),
);