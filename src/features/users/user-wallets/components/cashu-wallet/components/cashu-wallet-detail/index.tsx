import { Bitcoin, CheckIcon, Copy, Landmark, RadioIcon, RefreshCw, WalletIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ellipsis } from '@/shared/utils';

import { useCashuWalletDetail } from './hooks';

export const CashuWalletDetail = () => {
  const {
    wallet,
    mintList,
    loading,
    error,
    transactions,
    balance,
    fetchTransactions,
    copyToClipboard,
    hasCopied,
    copyPrivateKeyToClipboard,
    hasCopiedPrivateKey,
    navigate,
  } = useCashuWalletDetail();

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
            <p className="opacity-50 mt-1">Loading Cashu wallet...</p>
          </Skeleton>
        </div>
      ) : error ? (
        <div className="border p-4 rounded-lg text-red-500">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      ) : !wallet ? (
        <div className="border p-4 rounded-lg text-center">
          <p className="text-muted-foreground">No Cashu wallet found</p>
        </div>
      ) : (
        <>
          <div className="w-full mb-6">
            <div className="rounded-2xl border shadow-sm p-6 flex items-center justify-between bg-amber-500/15">
              <div>
                <p className="text-sm mb-1">Cashu Balance</p>
                <div className="text-3xl font-bold tracking-tight">
                  {balance.toLocaleString()} sats
                </div>
                <div className="text-xs">{(balance / 100000000).toFixed(8)} BTC</div>
              </div>
              <Bitcoin className="text-yellow-500" size={50} strokeWidth={1.3} />
            </div>
          </div>

          <div className="rounded-lg border mb-6">
            <h4 className="text-lg font-semibold p-4 border-b">Wallet Information</h4>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mintList?.pubkey && (
                  <div>
                    <p className="text-muted-foreground">P2PK</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{mintList.pubkey}</p>
                      <Button
                        variant="ghost"
                        className="bg-unset hover:bg-primary/15 text-current hover:text-current h-6 p-1"
                        onClick={() => copyToClipboard(mintList.pubkey!)}
                      >
                        {hasCopied ? (
                          <CheckIcon size={18} className="text-green-600" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </Button>
                    </div>
                    {wallet.privkeys.get(mintList.pubkey)?.privateKey && (
                      <div className="mt-2">
                        <p className="text-muted-foreground mb-1">Private Key</p>
                        <div className="flex items-center gap-2">
                          <Input
                            type="password"
                            value={wallet.privkeys.get(mintList.pubkey)?.privateKey || ''}
                            readOnly
                            className="text-xs font-mono"
                          />
                          <Button
                            variant="ghost"
                            className="bg-unset hover:bg-primary/15 text-current hover:text-current h-6 p-1"
                            onClick={() =>
                              copyPrivateKeyToClipboard(
                                wallet.privkeys.get(mintList?.pubkey!)?.privateKey || '',
                              )
                            }
                          >
                            {hasCopiedPrivateKey ? (
                              <CheckIcon size={18} className="text-green-600" />
                            ) : (
                              <Copy size={18} />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-muted-foreground">Balance</p>
                  <p className="font-medium">{balance.toLocaleString()} sats</p>
                </div>
              </div>

              {wallet.mints.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h5 className="flex items-center gap-2 font-medium mb-3">
                    <Landmark size={16} /> Mints ({wallet.mints.length})
                  </h5>
                  <div className="rounded text-sm space-y-2">
                    {wallet.mints.map((mint, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-muted-foreground">{new URL(mint).hostname}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mintList?.relays && mintList.relays.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h5 className="flex items-center gap-2 font-medium mb-3">
                    <RadioIcon size={16} /> Relays ({mintList.relays.length})
                  </h5>
                  <div className="rounded text-sm space-y-2">
                    {mintList.relays.map((relay, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-muted-foreground">{new URL(relay).hostname}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="text-lg font-semibold">Transaction History</h4>
              <Button variant="outline" size="sm" onClick={fetchTransactions}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            {transactions.length === 0 ? (
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
                      <th className="p-2 text-left min-w-20">Mint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-primary/15 text-xs">
                        <td className="p-2">
                          <span
                            className={tx.direction === 'in' ? 'text-green-600' : 'text-red-600'}
                          >
                            {tx.direction === 'in' ? 'Received' : 'Sent'}
                          </span>
                        </td>
                        <td className="p-2">
                          {tx.amount} {tx.unit}
                        </td>
                        <td className="p-2">{new Date(tx.createdAt * 1000).toLocaleString()}</td>
                        <td className="p-2 truncate max-w-xs">{tx.description || '-'}</td>
                        <td className="p-2 truncate max-w-xs">
                          {tx.mint ? ellipsis(new URL(tx.mint).hostname, 15) : 'Unknown mint'}
                        </td>
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
