import { FollowSetItem } from './components/follow-set-item';

export const FollowSet = ({ tags }: { tags: string[][]; address: string }) => {
  const title = tags.find((tag) => tag[0] === 'title');
  const description = tags.find((tag) => tag[0] === 'description');

  return (
    <div className="flex flex-col gap-1 p-2 rounded-md overflow-y-auto max-h-80 [overflow-wrap:anywhere]">
      <h4>{title?.[1]}</h4>
      <p className="mb-1">{description?.[1]}</p>
      {tags
        .filter((tag) => tag[0] === 'p')
        .map((tag, index) => (
          <FollowSetItem key={index} pubkey={tag[1]} />
        ))}
    </div>
  );
};
