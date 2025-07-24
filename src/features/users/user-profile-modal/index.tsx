import { CheckIcon, Copy, ExternalLink, User } from 'lucide-react';

import { NDKUser } from '@nostr-dev-kit/ndk';
import { useNdk, useProfile } from 'nostr-hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserAvatar } from '@/features/users';

import { Button } from '@/shared/components/ui/button';
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
  const navigate = useNavigate();

  const { profile } = useProfile({ pubkey });

  const { ndk } = useNdk();

  useEffect(() => {
    const _user = ndk?.getUser({ pubkey });

    _user && setUser(_user);
  }, [ndk, setUser]);

  const { hasCopied, copyToClipboard } = useCopyToClipboard();

  const handleViewProfile = () => {
    if (user?.npub) {
      // بستن modal
      onClose();
      // navigate به صفحه پروفایل با state برای smart navigation
      navigate(`/user/${user.npub}`, {
        state: { from: window.location.pathname },
      });
    }
  };

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

                <div className="flex flex-col gap-2 w-full mt-2">
                  <Button onClick={handleViewProfile} className="w-full" variant="default">
                    <User className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>

                  <a
                    href={`https://njump.me/${user?.npub}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center underline text-blue-400 inline-flex items-center justify-center gap-1 py-2"
                  >
                    Check out the Njump profile
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </>
            )}
            <p className="text-gray-500 w-full [overflow-wrap:anywhere]">{profile?.about}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
