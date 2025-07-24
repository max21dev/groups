import { CheckIcon, Copy } from 'lucide-react';

import { useProfile } from 'nostr-hooks';

import { UserAvatar } from '@/features/users';

import { Spinner } from '@/shared/components/spinner';
import { Input } from '@/shared/components/ui/input';
import { useCopyToClipboard, useUserRouting } from '@/shared/hooks';
import { formatTimestampToDate } from '@/shared/utils';

export const UserInfo = () => {
  const { pubkey, npub, isValid } = useUserRouting();
  const { profile, status } = useProfile({ pubkey: pubkey || undefined });
  const { hasCopied, copyToClipboard } = useCopyToClipboard();

  if (!isValid || !pubkey || !npub) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">
        Invalid user identifier
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <div className="w-full p-24 relative bg-slate-300 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
          {profile?.banner && (
            <img
              src={profile?.banner}
              alt="User banner"
              className="absolute h-full w-full object-cover"
            />
          )}
        </div>
        <div className="w-full relative">
          <div className="w-36 h-36 absolute -top-20 left-6 rounded-full border-4 border-primary-foreground bg-primary-foreground text-2xl [&_span]:w-full [&_span]:h-full">
            <UserAvatar pubkey={pubkey} width={240} height={240} />
          </div>
        </div>
        <div className="mt-16 px-6 pb-4 h-full flex flex-col gap-2">
          <p className="text-xl font-semibold">{profile?.displayName || profile?.name}</p>
          <p className="text-gray-500 break-words max-w-80">{profile?.nip05}</p>
          {profile?.created_at && (
            <p className="text-muted-foreground">
              Joined Nostr on {formatTimestampToDate(profile.created_at)}
            </p>
          )}
          <p className="text-gray-500 w-full [overflow-wrap:anywhere]">{profile?.about}</p>
          <div className="flex flex-row-reverse items-center gap-2 w-full">
            <button
              onClick={() => npub && copyToClipboard(npub)}
              className="outline-none text-gray-500"
            >
              {hasCopied ? <CheckIcon className="text-green-600" /> : <Copy />}
            </button>
            <Input value={npub} readOnly />
          </div>
          {profile?.website && (
            <a href={profile?.website} className="text-pink-400 hover:underline">
              {profile?.website}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
