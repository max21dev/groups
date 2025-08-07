export type WalletInfo = {
  alias?: string;
  network?: string;
  pubkey?: string;
  color?: string;
  block_height?: number;
  methods?: string[];
  lud16?: string;
  metadata?: {
    [key: string]: any;
  };
};

export type Transaction = {
  type: 'incoming' | 'outgoing';
  invoice?: string;
  description?: string;
  description_hash?: string;
  preimage?: string;
  payment_hash?: string;
  amount: number;
  fees_paid?: number;
  created_at: number;
  expires_at?: number;
  settled_at?: number;
};

export interface CashuTransaction {
  id: string;
  direction: 'in' | 'out';
  amount: number;
  createdAt: number;
  createdTokens: string[];
  destroyedTokens: string[];
  unit?: string;
  mint?: string;
  description?: string;
  fee?: number;
}
