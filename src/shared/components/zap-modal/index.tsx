import { Loader2 } from 'lucide-react';

import { UserAvatar, UserName } from '@/features/users';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import { Small } from '@/shared/components/ui/typography/small';
import { ellipsis } from '@/shared/utils';

import { ZAP_AMOUNTS } from './config';
import { useZapModal } from './hooks';

export const ZapModal = () => {
  const {
    comment,
    image,
    displayName,
    selectedAmount,
    setComment,
    setSelectedAmount,
    processing,
    process,
    isZapModalOpen,
    setIsZapModalOpen,
    walletCodes,
    selectedWallet,
    setSelectedWallet,
    safeParsePubkey,
  } = useZapModal();

  return (
    <Dialog open={isZapModalOpen} onOpenChange={(open) => setIsZapModalOpen(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage src={image} />
              <AvatarFallback>{displayName?.[0]}</AvatarFallback>
            </Avatar>

            <span>Send sats to {displayName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-2">
          <Small>Zap amount in Sats:</Small>

          <div className="grid grid-cols-4 gap-4">
            {ZAP_AMOUNTS.map((zapAmount) => (
              <Button
                key={zapAmount.id}
                onClick={() => setSelectedAmount(zapAmount)}
                variant={selectedAmount.id == zapAmount.id ? 'default' : 'outline'}
              >
                {zapAmount.label}
              </Button>
            ))}

            <Button
              onClick={() => setSelectedAmount({ amount: 21, id: 0, label: '' })}
              variant={ZAP_AMOUNTS.includes(selectedAmount) ? 'outline' : 'default'}
            >
              Custom
            </Button>

            {!ZAP_AMOUNTS.includes(selectedAmount) && (
              <Input
                placeholder="Custom amount in Sats"
                type="number"
                min={1}
                autoFocus
                className="col-span-3"
                value={selectedAmount.amount}
                onChange={(e) =>
                  setSelectedAmount({ id: 0, amount: parseInt(e.target.value), label: '' })
                }
              />
            )}
          </div>
        </div>

        {walletCodes.length > 0 && (
          <div className="mt-2">
            <Small>Select Wallet (optional):</Small>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full text-xs">
                  {selectedWallet ? ellipsis(selectedWallet, 40) : 'Browser Wallet (WebLN)'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuLabel>Use</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedWallet}
                  onValueChange={(val) => setSelectedWallet(val)}
                >
                  <DropdownMenuRadioItem value="">Browser (WebLN)</DropdownMenuRadioItem>
                  {walletCodes.map((code) => {
                    const pubkey = safeParsePubkey(code);
                    return (
                      <DropdownMenuRadioItem key={code} value={code}>
                        <div className="flex items-center gap-2 [&_span]:w-6 [&_span]:h-6 [&_span]:text-xs">
                          <UserAvatar pubkey={pubkey} />
                          <UserName pubkey={pubkey} length={20} className="text-xs" />
                        </div>
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <Small>Comment:</Small>

          <Input value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            disabled={!selectedAmount.amount || processing}
            onClick={() => {
              process();
            }}
          >
            {processing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `⚡️ Zap ${selectedAmount.amount || '_'} sats`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
