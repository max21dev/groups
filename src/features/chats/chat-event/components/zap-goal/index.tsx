import { NostrEvent } from '@nostr-dev-kit/ndk';

import { UserAvatar, UserName } from '@/features/users';

import { RichText } from '@/shared/components/rich-text';
import { Progress } from '@/shared/components/ui/progress';
import { formatTimestampToDate } from '@/shared/utils';

import { useZapGoal } from './hooks';

export const ZapGoal = ({ event }: { event: NostrEvent }) => {
  const { content, closedAt, contributors, isEventPage, percentage, targetMsats } =
    useZapGoal(event);

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      <div className="[&_*]:text-base">
        <RichText content={content} />
      </div>
      <p className="text-sm mt-2">Target: {(targetMsats / 1000).toLocaleString()} sats</p>

      <div className="mt-2 flex items-center gap-2">
        <Progress value={percentage} className="h-3 rounded-full" />
        <p className="text-xs inline-block whitespace-nowrap text-muted-foreground text-center">
          {percentage}%
        </p>
      </div>

      {closedAt && (
        <p className="w-fit text-xs text-muted-foreground">
          {Date.now() > closedAt * 1000
            ? 'Goal closed'
            : `Close at: ${formatTimestampToDate(closedAt)}`}
        </p>
      )}

      {isEventPage && contributors.length > 0 && (
        <div className="mt-4 divide-y divide-primary/20">
          {contributors.map(({ pubkey, msats, message }, idx) => (
            <div key={idx} className="flex items-start p-2 gap-2">
              <div>
                <div className="flex items-center gap-2 mt-2 [&_span]:w-7 [&_span]:h-7 [&_span]:text-xs">
                  <UserAvatar pubkey={pubkey} />
                  <UserName pubkey={pubkey} length={16} className="text-xs" />
                </div>
                <p className="my-1 text-sm text-muted-foreground">
                  {(msats / 1000).toLocaleString()} sats
                </p>
                {message && <p className="text-sm">{message}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
