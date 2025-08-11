export type CompatibleApp = {
  id: string;
  name: string;
  picture?: string;
  url: string;
};

export type RecTarget = { pubkey: string; d: string; relayHint?: string; platform?: string };

export type BechType = 'nevent' | 'naddr' | 'nprofile';

export type WebTag = { urlTpl: string; tagType?: BechType };
