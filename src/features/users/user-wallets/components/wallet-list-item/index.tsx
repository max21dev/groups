import { Bitcoin, ExternalLink, RadioIcon, Trash2Icon, ZapIcon } from 'lucide-react';

import UserAvatar from '@/features/users/user-avatar';
import { UserName } from '@/features/users/user-name';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ellipsis } from '@/shared/utils';

import { useWalletListItem } from './hooks';

export const WalletListItem = ({ code }: { code: string }) => {
  const { balance, error, info, isLoading, lud16, navigate, pubkey, relays, removeWallet } =
    useWalletListItem(code);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Remote Wallet</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-4">
        <div className="flex items-center justify-center my-2">
          {isLoading ? (
            <Skeleton className="w-14 h-14 rounded-full flex items-center justify-center">
              <Bitcoin size={30} />
            </Skeleton>
          ) : error ? (
            <div className="text-sm text-center text-red-500">{error}</div>
          ) : (
            <div className="w-full flex items-center justify-center text-4xl font-semibold">
              {balance !== null ? balance : '-'} <Bitcoin size={22} className="mt-2 ms-2" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2 [&_span]:w-6 [&_span]:h-6 [&_span]:text-xs">
          <UserAvatar pubkey={pubkey} />
          <UserName pubkey={pubkey} length={7} className="text-xs" />
          {info?.metadata?.name && (
            <p className="ms-auto text-sm">{ellipsis(info?.metadata?.name, 7)}</p>
          )}
        </div>

        {lud16 && (
          <div className="flex items-center gap-1 text-xs">
            <ZapIcon size={18} />
            {lud16}
          </div>
        )}
        {relays.length > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <RadioIcon size={18} /> {relays.join(', ')}
          </div>
        )}

        <div className="flex gap-2 justify-between mt-2">
          <Button onClick={() => removeWallet(code)} variant="destructive">
            <Trash2Icon size={16} />
          </Button>
          <Button
            onClick={() => navigate(`/wallets/${encodeURIComponent(code)}`)}
            variant="outline"
          >
            <ExternalLink size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
