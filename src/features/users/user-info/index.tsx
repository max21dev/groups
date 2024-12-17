import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { CheckIcon, Copy } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Input } from '@/shared/components/ui/input';

import { useCopyToClipboard } from '@/shared/hooks';
import { cn, getAvatarFallbackColor, loader } from '@/shared/utils';

import { formatTimestampToDate } from '@/shared/utils/date';

export const UserInfo = ({
  profile,
  pubkey,
  npub,
}: {
  profile: NDKUserProfile | null | undefined;
  pubkey: string;
  npub: string;
}) => {
  const { hasCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="shadow w-full rounded-lg bg-white dark:bg-slate-950 flex flex-col gap-4 overflow-hidden">
      <div className="w-full h-48 bg-slate-300 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
        {profile?.banner && (
          <img src={profile?.banner} alt="User banner" className="h-auto w-full" />
        )}
      </div>
      <div className="w-full relative">
        <Avatar className="w-36 h-36 absolute -top-20 left-6 border-4 bg-white border-white dark:border-slate-950 dark:bg-slate-950 dark:[&_*]:text-white">
          <AvatarImage src={loader(profile?.image || '', { w: 100, h: 100 })} alt={profile?.name} />

          <AvatarFallback
            className={cn('text-primary-foreground text-2xl', getAvatarFallbackColor(pubkey))}
          >
            {pubkey.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
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
