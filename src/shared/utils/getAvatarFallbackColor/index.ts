const colors = [
  'bg-amber-600',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
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
