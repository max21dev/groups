import { Crown, Image as ImageIcon, Shield, Users } from 'lucide-react';

import { NostrEvent } from '@nostr-dev-kit/ndk';

import { UserAvatar, UserName } from '@/features/users';

import { RichText } from '@/shared/components/rich-text';
import { Badge } from '@/shared/components/ui/badge';

export const ModeratedCommunity = ({ event }: { event: NostrEvent }) => {
  const identifier = event.tags.find((tag) => tag[0] === 'd')?.[1] || '';
  const name = event.tags.find((tag) => tag[0] === 'name')?.[1] || identifier || '';
  const description =
    event.tags.find((tag) => tag[0] === 'description')?.[1] || event.content || '';
  const image = event.tags.find((tag) => tag[0] === 'image')?.[1];
  const rules = event.tags.find((tag) => tag[0] === 'rules')?.[1];
  const rankMode = event.tags.find((tag) => tag[0] === 'rank_mode')?.[1];
  const rankBatch = event.tags.find((tag) => tag[0] === 'rank_batch')?.[1];

  const moderators = event.tags
    .filter((tag) => tag[0] === 'p' && tag[3] === 'moderator')
    .map((tag) => ({
      pubkey: tag[1],
      relay: tag[2] || '',
      role: tag[3],
    }));

  const relays = event.tags
    .filter((tag) => tag[0] === 'relay')
    .map((tag) => ({
      url: tag[1],
      marker: tag[2] || '',
    }));

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {image && <img src={image} alt={name} className="w-full rounded-lg object-cover" />}
          <div className="flex items-center gap-2 mb-1">
            <Crown size={18} className="text-yellow-500" />
            <h4 className="text-lg font-bold leading-tight">{name}</h4>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              {rankMode && (
                <Badge variant="secondary" className="text-xs">
                  Ranked by {rankMode}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {description && (
          <div className="[&_*]:text-sm border-l-2 border-primary/20 pl-3">
            <RichText content={description} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary/5 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <Shield size={14} className="text-blue-500" />
            Moderators
          </div>
          <div className="text-lg font-bold">{moderators.length}</div>
        </div>
        {rankBatch && (
          <div className="bg-primary/5 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm font-medium mb-1">
              <Users size={14} className="text-green-500" />
              Rank Batch
            </div>
            <div className="text-lg font-bold">{rankBatch}</div>
          </div>
        )}
      </div>

      {moderators.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-medium text-sm flex items-center gap-2">
            <Shield size={16} className="text-blue-500" />
            Community Moderators
          </h5>
          <div className="grid grid-cols-1 gap-2">
            {moderators.map((moderator) => (
              <div
                key={moderator.pubkey}
                className="flex items-center gap-2 p-1 rounded-lg bg-primary/5"
              >
                <span className="[&_span]:w-8 [&_span]:h-8">
                  <UserAvatar pubkey={moderator.pubkey} />
                </span>
                <div className="flex-1 min-w-0">
                  <UserName pubkey={moderator.pubkey} />
                  <div className="text-xs text-muted-foreground">Moderator</div>
                </div>
                <Badge variant="secondary">
                  <Shield size={12} className="mr-1" />
                  Mod
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {rules && (
        <div className="space-y-3">
          <h5 className="font-medium text-sm flex items-center gap-2">
            <ImageIcon size={16} className="text-amber-500" />
            Community Rules
          </h5>
          <div className="bg-primary/5 rounded-lg p-3">
            <div className="[&_*]:text-sm whitespace-pre-wrap">
              <RichText content={rules} />
            </div>
          </div>
        </div>
      )}

      {relays.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-medium text-sm">Community Relays</h5>
          <div className="space-y-1">
            {relays.map((relay, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-primary/5 text-xs"
              >
                <span className="font-mono truncate">{relay.url}</span>
                {relay.marker && <Badge variant="secondary">{relay.marker}</Badge>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Community ID:</span>{' '}
          <span className="font-mono">{identifier}</span>
        </div>
      </div>
    </div>
  );
};
