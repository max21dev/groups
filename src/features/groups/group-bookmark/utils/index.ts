export const normalizeBookmarkList = (list: { id: string; relay: string; name?: string }[]) => {
  return [...list].sort((a, b) => {
    if (a.id === b.id) return (a.relay || '').localeCompare(b.relay || '');
    return a.id.localeCompare(b.id);
  });
};