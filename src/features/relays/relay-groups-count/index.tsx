import { useRelayGroupsCount } from './hooks';

export const RelayGroupsCount = () => {
  const { relayGroupsCount } = useRelayGroupsCount();

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center text-2xl">
        <span className="font-medium">Groups</span>
        <span className="text-zinc-300">({relayGroupsCount})</span>
      </div>
    </div>
  );
};
