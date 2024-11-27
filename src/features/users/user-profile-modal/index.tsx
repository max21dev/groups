import { NDKUser } from '@nostr-dev-kit/ndk';
import { CheckIcon, Copy, ExternalLink } from 'lucide-react';
import { useNdk } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';

import { useCopyToClipboard } from '@/shared/hooks';

import { useUserPofileModal } from './hooks';

type UserProfileModalProps = {
  pubkey: string;
  isOpen: boolean;
  onClose: () => void;
};

export function UserProfileModal({ pubkey, isOpen, onClose }: UserProfileModalProps) {
  const [user, setUser] = useState<NDKUser>();

  const { profile } = useUserPofileModal({ pubkey });

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
            <img src={profile?.image} alt="User Avatar" className="rounded-full w-24 h-24" />
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
}
