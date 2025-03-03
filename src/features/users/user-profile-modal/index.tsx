import { CheckIcon, Copy, ExternalLink } from 'lucide-react';

import { NDKUser } from '@nostr-dev-kit/ndk';
import { useNdk, useProfile } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { UserAvatar } from '@/features/users';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { useCopyToClipboard } from '@/shared/hooks';

type UserProfileModalProps = {
  pubkey: string;
  isOpen: boolean;
  onClose: () => void;
};

export const UserProfileModal = ({ pubkey, isOpen, onClose }: UserProfileModalProps) => {
  const [user, setUser] = useState<NDKUser>();

  const { profile } = useProfile({ pubkey });

  const { ndk } = useNdk();

  useEffect(() => {
    const _user = ndk?.getUser({ pubkey });

    _user && setUser(_user);
  }, [ndk, setUser]);

  const { hasCopied, copyToClipboard } = useCopyToClipboard();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="flex flex-col items-center gap-2">
            <div className="h-24 w-24 text-2xl [&_span]:w-full [&_span]:h-full">
              <UserAvatar pubkey={user?.pubkey || ''} width={160} height={160} />
            </div>

            <p className="mt-4 text-xl font-semibold">{profile?.displayName || profile?.name}</p>
            <p className="text-gray-500 break-words max-w-80">{profile?.nip05}</p>
            {user?.npub && (
              <>
                <div className="flex flex-row-reverse items-center gap-2 w-full">
                  <button
                    onClick={() => copyToClipboard(user?.npub)}
                    className="outline-none text-gray-500"
                  >
                    {hasCopied ? <CheckIcon className="text-green-600" /> : <Copy />}
                  </button>
                  <Input value={user?.npub} readOnly />
                </div>
                <a
                  href={`https://njump.me/${user?.npub}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-400 inline-flex items-center gap-1"
                >
                  Check out the Njump profile
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            )}
            <p className="text-gray-500 w-full [overflow-wrap:anywhere]">{profile?.about}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
