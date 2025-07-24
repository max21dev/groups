export const formatExternalHref = (raw: string): string => {
  if (!raw) return '#';
  const trimmed = raw.trim();

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.includes('@') && !trimmed.includes(' ')) {
    return `mailto:${trimmed}`;
  }

  return `https://${trimmed}`;
};
