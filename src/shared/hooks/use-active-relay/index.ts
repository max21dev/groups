import { useNavigate, useParams } from 'react-router-dom';

export const useActiveRelay = () => {
  const { relay } = useParams();

  const navigate = useNavigate();

  const setActiveRelay = (relay: string | undefined) => {
    if (relay) {
      navigate(`/relay/${relay.replace('wss://', '')}`);
    } else {
      navigate(`/`);
    }
  };

  const activeRelay = !relay ? undefined : relay.startsWith('ws://') ? relay : `wss://${relay}`;

  return { activeRelay, setActiveRelay };
};
