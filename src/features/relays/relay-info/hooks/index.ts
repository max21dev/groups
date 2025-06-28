import { useEffect, useState } from 'react';

import { RelayInformation } from '../types';

export const useRelayInfo = (activeRelay: string | undefined) => {
  const [relayInfo, setRelayInfo] = useState<RelayInformation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeRelay) {
      fetchRelayInfo();
    }
  }, [activeRelay]);

  const fetchRelayInfo = async () => {
    if (!activeRelay) return;

    setIsLoading(true);
    setError(null);

    try {
      const httpUrl = activeRelay.replace(/^wss?:\/\//, 'https://');

      const response = await fetch(httpUrl, {
        headers: {
          Accept: 'application/nostr+json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: RelayInformation = await response.json();
      setRelayInfo(data);
    } catch (err) {
      console.error('Error fetching relay info:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch relay information');
    } finally {
      setIsLoading(false);
    }
  };

  return { relayInfo, isLoading, error };
};
