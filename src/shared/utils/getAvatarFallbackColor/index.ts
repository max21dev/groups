const colors = [
  'bg-amber-600/50',
  'bg-blue-500/50',
  'bg-green-500/50',
  'bg-yellow-500/50',
  'bg-purple-500/50',
  'bg-pink-500/50',
];

const getHash = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
};

export const getAvatarFallbackColor = (str: string) => {
  const hash = getHash(str);
  const index = Math.abs(hash) % colors?.length;

  return colors[index];
};
