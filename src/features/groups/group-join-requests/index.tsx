import { UserPlusIcon } from 'lucide-react';
import { useState } from 'react';

import { UserAvatar, UserName } from '@/features/users';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

import { useJoinRequests } from './hooks';

export const JoinRequests = ({
  relay,
  groupId,
}: {
  relay: string | undefined;
  groupId: string | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { activeUser, isAdmin, joinRequests, acceptJoinRequest, rejectJoinRequest, isGroupClosed } =
    useJoinRequests(relay, groupId);

  if (!activeUser || !isAdmin || !isGroupClosed) return null;

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="relative ps-3 pe-2">
        <UserPlusIcon size={18} />
        {joinRequests.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
            {joinRequests.length}
          </span>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Requests ({joinRequests.length})</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[300px]">
            {joinRequests.length === 0 ? (
              <p className="text-muted-foreground">No pending requests.</p>
            ) : (
              joinRequests.map((request) => (
                <div key={request.id} className="flex justify-between items-center p-2 border-b">
                  <div className="flex items-center gap-2">
                    <UserAvatar pubkey={request.pubkey} />
                    <UserName pubkey={request.pubkey} length={9} />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acceptJoinRequest(request.pubkey)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => rejectJoinRequest(request.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
