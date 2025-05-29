import { Bitcoin, CheckIcon, Copy, WalletIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ellipsis } from '@/shared/utils';

import { useWalletDetail } from './hooks';

export const WalletDetail = () => {
  const {
    balance,
    copyToClipboard,
    error,
    formatSats,
    hasCopied,
    info,
    loading,
    navigate,
    txs,
    decodedCode,
  } = useWalletDetail();

  return (
    <>
      <div className="w-full max-w-2xl">
        <Button variant="outline" className="me-auto mb-2" onClick={() => navigate('/wallets')}>
          Back to Wallets
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Skeleton className="w-full rounded-lg py-10 mx-auto mb-4">
            <WalletIcon size={70} strokeWidth={1.3} className="mx-auto opacity-50" />
            <p className="opacity-50 mt-1">Loading wallet data...</p>
          </Skeleton>
        </div>
      ) : error ? (
        <div className="border p-4 rounded-lg text-red-500">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="w-full mb-6">
            <div className="rounded-2xl border shadow-sm p-6 flex items-center justify-between bg-amber-500/15">
              <div>
                <p className="text-sm mb-1">Current Balance</p>
                <div className="text-3xl font-bold tracking-tight">
                  {balance !== null ? `${(balance / 1000).toLocaleString()} sats` : '—'}
                </div>
                <div className="text-xs">
                  {balance !== null ? `${(balance / 1000 / 100000000).toFixed(8)} BTC` : ''}
                </div>
              </div>
              <Bitcoin className="text-yellow-500" size={50} strokeWidth={1.3} />
            </div>
          </div>
          <div className="rounded-lg border mb-6">
            <h4 className="text-lg font-semibold p-4 border-b">Wallet Information</h4>
            <div className="p-4">
              {info ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Alias</p>
                    <p className="font-medium">{info.alias || 'Unnamed Wallet'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Network</p>
                    <p className="font-medium">{info.network || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Node Pubkey</p>
                    <p className="font-medium text-sm truncate">{info.pubkey || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Balance</p>
                    <p className="font-medium">{formatSats(balance)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Basic wallet information not available</p>
              )}

              <div className="mt-6 pt-6 border-t">
                <h5 className="font-medium mb-3">Connection Details</h5>
                <div className="rounded text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="break-all">
                      <span className="font-medium">NWC URI:</span> {ellipsis(decodedCode, 70)}
                    </p>
                    <Button
                      variant="ghost"
                      className="bg-unset hover:bg-primary/15 text-current hover:text-current h-6 p-1"
                      onClick={() => copyToClipboard(decodedCode)}
                    >
                      {hasCopied ? (
                        <CheckIcon size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </Button>
                  </div>
                  {decodedCode && (
                    <>
                      <p className="mt-2">
                        <span className="font-medium">Connected via:</span>{' '}
                        {new URL(decodedCode).searchParams.getAll('relay').join(', ')}
                      </p>
                    </>
                  )}
                  {info?.lud16 && (
                    <p className="mt-2">
                      <span className="font-medium">Lightning Address:</span> {info.lud16}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border">
            <h4 className="text-lg font-semibold p-4 border-b">Transaction History</h4>
            {txs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No transactions found for this wallet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left min-w-20">Type</th>
                      <th className="p-2 text-left min-w-20">Amount</th>
                      <th className="p-2 text-left min-w-20">Date</th>
                      <th className="p-2 text-left min-w-20">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txs.map((tx, index) => (
                      <tr key={index} className="border-b hover:bg-primary/15 text-xs">
                        <td className="p-2">
                          <span
                            className={tx.type === 'incoming' ? 'text-green-600' : 'text-red-600'}
                          >
                            {tx.type === 'incoming' ? 'Received' : 'Sent'}
                          </span>
                        </td>
                        <td className="p-2">{tx.amount / 1000} sats</td>
                        <td className="p-2">{new Date(tx.created_at * 1000).toLocaleString()}</td>
                        <td className="p-2 truncate max-w-xs">{tx.description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
