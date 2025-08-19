import { NostrEvent } from '@nostr-dev-kit/ndk';
import { OctagonAlertIcon } from 'lucide-react';

import { ChatEvent } from '@/features/chats';

import { getNostrLink } from '@/shared/utils';

import { useAppRecommendation } from './hooks';

export const AppRecommendation = ({ event }: { event: NostrEvent }) => {
  const { data, loading, error } = useAppRecommendation(event);

  if (loading) return <div className="animate-pulse">Loading app recommendation…</div>;

  if (error || !data)
    return (
      <div className="flex items-center gap-1 text-sm">
        <OctagonAlertIcon size={18} /> Failed to load recommendation.
      </div>
    );

  const { supportedKind, handlers } = data;

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      <p className="text-sm">
        Recommends app(s) for kind:{' '}
        <span className="bg-primary/15 px-2 py-0.5 rounded-full text-xs">
          {supportedKind ?? 'Unknown'}
        </span>
      </p>

      <div className="flex flex-col gap-3">
        {handlers.map((h, idx) => (
          <div key={`${h.aRef}-${idx}`}>
            {h.handlerEvent ? (
              <ChatEvent
                event={
                  getNostrLink(h.handlerEvent.id!, h.handlerEvent.pubkey, h.handlerEvent.kind) ||
                  h.handlerEvent.id!
                }
              />
            ) : (
              <div className="text-xs opacity-80">
                Handler event <code>{h.aRef}</code> not found.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
