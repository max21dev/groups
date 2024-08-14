import { useRelayGroupsCount } from './hooks';

export const RelayGroupsCount = () => {
  const { relayGroupsCount } = useRelayGroupsCount();

  return (
    <div className="flex justify-between p-2 items-center">
      <div className="flex gap-2 items-center text-2xl">
        <p className="font-medium">Groups</p>
        <span className="text-zinc-300">({relayGroupsCount})</span>
      </div>
    </div>
  );
};