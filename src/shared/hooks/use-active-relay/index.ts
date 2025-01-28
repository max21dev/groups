import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useActiveRelay = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const relay = useMemo(() => searchParams.get('relay') || undefined, [searchParams]);

  const setActiveRelay = (relay: string | undefined) => {
    if (relay) {
      setSearchParams({ relay });
    } else {
      setSearchParams({});
    }
  };

  return { activeRelay: relay, setActiveRelay };
};
