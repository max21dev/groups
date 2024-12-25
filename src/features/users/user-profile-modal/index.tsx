import { NDKUser } from '@nostr-dev-kit/ndk';
import { CheckIcon, Copy, ExternalLink } from 'lucide-react';
import { useNdk, useProfile } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';

import { useCopyToClipboard } from '@/shared/hooks';
import { cn, getAvatarFallbackColor } from '@/shared/utils';

type UserProfileModalProps = {
  pubkey: string;
  isOpen: boolean;
  onClose: () => void;
};

export const UserProfileModal = ({ pubkey, isOpen, onClose }: UserProfileModalProps) => {
  const [user, setUser] = useState<NDKUser>();
  const [imageError, setImageError] = useState(false);

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
            {profile?.image && !imageError ? (
              <img
                src={profile.image}
                alt="User Avatar"
                className="rounded-full w-24 h-24"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className={cn(
                  'flex justify-center items-center text-2xl text-primary-foreground rounded-full w-24 h-24',
                  getAvatarFallbackColor(pubkey),
                )}
              >
                {pubkey.slice(0, 2).toUpperCase()}
              </div>
            )}
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
