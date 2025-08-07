import {
  Bitcoin,
  ExternalLink,
  Key,
  Landmark,
  Loader2,
  RadioIcon,
  RefreshCw,
  Wallet,
} from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ellipsis } from '@/shared/utils';

import { CreateCashuWallet } from './components';
import { useCashuWallet } from './hooks';

export const CashuWallet = () => {
  const { wallet, mintList, loading, error, balance, refreshing, handleRefresh, navigate } =
    useCashuWallet();

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Cashu Wallet
          {wallet && (
            <Badge variant="outline" className="ml-auto text-green-600 border-green-600 text-xs">
              Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-4">
        {loading ? (
          <div className="flex items-center justify-center my-2">
            <Skeleton className="w-14 h-14 rounded-full flex items-center justify-center">
              <Loader2 className="animate-spin" size={30} />
            </Skeleton>
          </div>
        ) : error ? (
          <div className="text-sm text-center text-red-500 my-4">
            {error}
            <Button onClick={handleRefresh} variant="ghost" size="sm" className="ml-2">
              <RefreshCw size={14} />
            </Button>
          </div>
        ) : !wallet ? (
          <div className="text-center my-6">
            <p className="text-primary/60 mb-4">No Cashu wallet found</p>
            <CreateCashuWallet />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center my-4">
              <div className="w-full flex items-center justify-center text-4xl font-semibold">
                {balance} <Bitcoin size={22} className="mt-2 ms-2" />
              </div>
            </div>

            {mintList?.pubkey && (
              <div className="flex items-center justify-center gap-1 text-xs">
                <Key size={18} />
                <span className="font-mono">{ellipsis(mintList.pubkey, 16)}</span>
              </div>
            )}

            {wallet?.mints.length > 0 && (
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <Landmark size={18} />
                  <span className="font-semibold">Mints ({wallet.mints.length})</span>
                </div>
                <div className="ml-6 space-y-1 truncate">
                  {wallet.mints.map((mint, index) => (
                    <div key={index} className="text-primary/80 text-xs">
                      {new URL(mint).hostname}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mintList && mintList?.relays.length > 0 && (
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <RadioIcon size={18} />
                  <span className="font-semibold">Relays ({mintList.relays.length})</span>
                </div>
                <div className="ml-6 space-y-1 truncate">
                  {mintList.relays.map((relay, index) => (
                    <div key={index} className="text-primary/80 text-xs">
                      {new URL(relay).hostname}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-between mt-2">
              <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
                {refreshing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
              </Button>
              <Button variant="outline" onClick={() => navigate('/wallets/cashu')}>
                <ExternalLink size={16} />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
