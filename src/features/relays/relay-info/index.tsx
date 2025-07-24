import { ExternalLink, Globe, Info, Shield, Zap } from 'lucide-react';

import { UserAvatar, UserName } from '@/features/users';

import { Spinner } from '@/shared/components/spinner';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { useRelayInfo } from './hooks';
import { formatExternalHref } from './utils';

export const RelayInfo = ({ activeRelay }: { activeRelay: string | undefined }) => {
  const { relayInfo, isLoading, error } = useRelayInfo(activeRelay);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Info className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unable to fetch relay information</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <p className="text-sm text-muted-foreground">
          This relay may not support NIP-11 or may be temporarily unavailable.
        </p>
      </div>
    );
  }

  if (!relayInfo) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">
        No relay information available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full overflow-y-auto mx-auto break-all">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {relayInfo.icon && (
              <img
                src={relayInfo.icon}
                alt="Relay Icon"
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <CardTitle className="text-xl">{relayInfo.name || activeRelay}</CardTitle>
              {relayInfo.description && (
                <p className="text-muted-foreground mt-2 whitespace-pre-line">
                  {relayInfo.description}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        {relayInfo.banner && (
          <CardContent className="pt-0">
            <img
              src={relayInfo.banner}
              alt="Relay Banner"
              className="w-full h-48 object-cover rounded-lg"
            />
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {relayInfo.software && (
            <div>
              <span className="font-medium">Software: </span>
              <a
                href={formatExternalHref(relayInfo.software)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 underline inline-flex items-center gap-1"
              >
                {relayInfo.software}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {relayInfo.version && (
            <div>
              <span className="font-medium">Version: </span>
              <code className="bg-muted px-2 py-1 rounded text-sm">{relayInfo.version}</code>
            </div>
          )}

          {relayInfo.pubkey && (
            <div>
              <span className="font-medium">Admin Contact: </span>
              <div className="flex items-center gap-2 mt-1">
                <UserAvatar pubkey={relayInfo.pubkey} />
                <UserName pubkey={relayInfo.pubkey} />
              </div>
            </div>
          )}

          {relayInfo.contact && (
            <div>
              <span className="font-medium">Alternative Contact: </span>
              <a
                href={formatExternalHref(relayInfo.contact)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 underline"
              >
                {relayInfo.contact}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {relayInfo.supported_nips && relayInfo.supported_nips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Supported NIPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {relayInfo.supported_nips.map((nip) => (
                <Badge key={nip} variant="secondary">
                  NIP-{nip.toString().padStart(2, '0')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {relayInfo.limitation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Server Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(relayInfo.limitation).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm font-medium">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:
                </span>
                <span className="text-sm text-muted-foreground">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value?.toLocaleString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {relayInfo.fees && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(relayInfo.fees).map(([type, fees]) => (
              <div key={type}>
                <h4 className="font-medium capitalize mb-2">{type}</h4>
                <div className="space-y-2">
                  {fees.map((fee, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {fee.period ? `${Math.round(fee.period / 86400)} days` : 'One-time'}
                      </span>
                      <span className="font-medium">
                        {fee.amount.toLocaleString()} {fee.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {(relayInfo.relay_countries || relayInfo.language_tags || relayInfo.tags) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Community Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {relayInfo.relay_countries && (
              <div>
                <span className="font-medium">Countries: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {relayInfo.relay_countries.map((country) => (
                    <Badge key={country} variant="outline">
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {relayInfo.language_tags && (
              <div>
                <span className="font-medium">Languages: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {relayInfo.language_tags.map((lang) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {relayInfo.tags && relayInfo.tags.length > 0 && (
              <div>
                <span className="font-medium">Tags: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {relayInfo.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(relayInfo.posting_policy ||
        relayInfo.privacy_policy ||
        relayInfo.terms_of_service ||
        relayInfo.payments_url) && (
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {relayInfo.posting_policy && (
              <a
                href={formatExternalHref(relayInfo.posting_policy)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-400 underline"
              >
                Posting Policy <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {relayInfo.privacy_policy && (
              <a
                href={formatExternalHref(relayInfo.privacy_policy)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-400 underline"
              >
                Privacy Policy <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {relayInfo.terms_of_service && (
              <a
                href={formatExternalHref(relayInfo.terms_of_service)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-400 underline"
              >
                Terms of Service <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {relayInfo.payments_url && (
              <a
                href={formatExternalHref(relayInfo.payments_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-400 underline"
              >
                Payments <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
