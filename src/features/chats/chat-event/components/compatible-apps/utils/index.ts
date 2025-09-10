import { BechType } from '../types';

export const normalizeNip19 = (n: string): string => {
  return n?.startsWith('nostr:') ? n.slice('nostr:'.length) : n;
};

export const getBechTypeFromNip19 = (nip19: string): BechType | undefined => {
  const v = normalizeNip19(nip19 || '');
  if (v.startsWith('nevent')) return 'nevent';
  if (v.startsWith('naddr')) return 'naddr';
  if (v.startsWith('nprofile')) return 'nprofile';
  return undefined;
};
