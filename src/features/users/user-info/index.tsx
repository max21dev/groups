import { CheckIcon, Copy } from 'lucide-react';

import { NDKUserProfile } from '@nostr-dev-kit/ndk';

import { UserAvatar } from '@/features/users';

import { Input } from '@/shared/components/ui/input';
import { useCopyToClipboard } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { formatTimestampToDate } from '@/shared/utils/date';

export const UserInfo = ({
  profile,
  pubkey,
  npub,
  className,
}: {
  profile: NDKUserProfile | null | undefined;
  pubkey: string;
  npub: string;
  className?: string;
}) => {
  const { hasCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div
      className={cn(
        'w-full bg-white dark:bg-slate-950 flex flex-col gap-4 overflow-hidden',
        className,
      )}
    >
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
      <div className="mt-16 px-8 pb-4 h-full flex flex-col gap-2">
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
          <a href={profile?.website} className="text-pink-400">
            {profile?.website}
          </a>
        )}
      </div>
    </div>
  );
};
