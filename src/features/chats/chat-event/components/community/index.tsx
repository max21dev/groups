import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';

import { getCommunityTags } from './utils';

export const Community = ({ event }: { event: NDKEvent }) => {
  const { relayTags, blossomTags, mintTags } = useMemo(() => getCommunityTags(event), [event]);

  return (
    <div className="w-full set-max-h overflow-auto flex flex-col gap-2 p-2">
      <div className="mt-2 space-y-3 text-sm">
        {relayTags.length > 0 && (
          <div>
            <p className="font-semibold">Relays:</p>
            {relayTags.map((tag) => (
              <span key={tag} className="underline">
                {tag}
              </span>
            ))}
          </div>
        )}
        {blossomTags.length > 0 && (
          <div>
            <p className="font-semibold">Media Servers:</p>
            {blossomTags.map((tag) => (
              <span key={tag} className="underline">
                {tag}
              </span>
            ))}
          </div>
        )}
        {mintTags.length > 0 && (
          <div>
            <p className="font-semibold">Mint:</p>
            {mintTags.map((tag) => (
              <span key={tag} className="underline">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {event && relayTags.length > 0 && (
        <Link to={`/?relay=${relayTags[0]}&groupId=${event.pubkey}`} className="mt-2">
          <Button className="w-full">Go to Community</Button>
        </Link>
      )}
    </div>
  );
};
