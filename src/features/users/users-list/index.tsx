import { UsersListItem } from './components/users-list-item';

export const UsersList = ({ tags }: { tags: string[][] }) => {
  const title = tags.find((tag) => tag[0] === 'title');
  const description = tags.find((tag) => tag[0] === 'description');
  return (
    <div className="flex flex-col gap-1 p-2 rounded-md overflow-y-scroll max-h-80 [overflow-wrap: anywhere;] max-w-80">
      <h4>{title?.[1]}</h4>
      <p className="mb-1">{description?.[1]}</p>
      {tags
        .filter((tag) => tag[0] === 'p')
        .map((tag, index) => (
          <UsersListItem key={index} pubkey={tag[1]} />
        ))}
    </div>
  );
};
