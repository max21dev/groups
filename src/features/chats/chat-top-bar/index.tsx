import { ArrowLeft, CheckIcon, Info, Share2 } from 'lucide-react';

import { CommunityDetails, GroupAvatar, GroupBookmark, GroupDetails } from '@/features/groups';
import { UserAvatar, UserName } from '@/features/users';

import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip.tsx';

import { useChatTopBar } from './hooks';

export const ChatTopBar = () => {
  const {
    metadata,
    isGroupDetailsOpen,
    toggleGroupDetails,
    activeGroupId,
    activeRelay,
    setActiveGroupId,
    isCommunity,
    copyToClipboard,
    hasCopied,
  } = useChatTopBar();

  return (
    <div className="flex justify-between items-center px-4 py-2">
      <div className="flex items-center gap-2">
        <ArrowLeft
          className="sm:hidden hover:cursor-pointer"
          onClick={() => setActiveGroupId(undefined)}
        />
        {isCommunity ? (
          <UserAvatar pubkey={activeGroupId || ''} />
        ) : (
          <GroupAvatar relay={activeRelay} groupId={activeGroupId} />
        )}
        <div className="flex flex-col">
          <span className="font-bold mt-0 mb-0">
            {isCommunity ? <UserName pubkey={activeGroupId} length={20} /> : metadata?.name}
          </span>
          <span className="text-xs font-light text-muted-foreground">
            {isCommunity
              ? 'Community'
              : `${metadata?.isPublic ? 'Public' : 'Private'} and ${
                  metadata?.isOpen ? 'Open' : 'Closed'
                }`}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <GroupBookmark groupId={activeGroupId} groupName={metadata?.name} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  copyToClipboard(
                    `${window.location.origin}/?relay=${activeRelay}&groupId=${activeGroupId}`,
                  )
                }
              >
                {hasCopied ? (
                  <CheckIcon size={25} className="text-green-600" />
                ) : (
                  <Share2 size={25} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {hasCopied ? 'Link Copied' : 'Copy Group Link To Share'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Sheet onOpenChange={() => toggleGroupDetails()}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Info size={25} />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full lg:max-w-screen-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle />
              <SheetDescription />
            </SheetHeader>
            {isGroupDetailsOpen && activeGroupId && (
              <div className="grid gap-4 py-4">
                {isCommunity ? (
                  <CommunityDetails relay={activeRelay} pubkey={activeGroupId} />
                ) : (
                  <GroupDetails relay={activeRelay} groupId={activeGroupId} />
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
