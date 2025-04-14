import { Nip29GroupChat } from 'nostr-hooks/nip29';
import db, { CachedGroupMessage } from './index';

export const saveGroupMessage = async (message: Nip29GroupChat, groupId: string): Promise<void> => {
  const cachedMessage: CachedGroupMessage = { ...message, groupId };
  try {
    await db.groupMessages.put(cachedMessage);
  } catch (error) {
    console.error('Error saving group message:', error);
  }
};

export const getGroupMessagesByGroupId = async (
  groupId: string,
  limit = 100,
): Promise<CachedGroupMessage[]> => {
  try {
    const messages = await db.groupMessages.where('groupId').equals(groupId).sortBy('timestamp');

    return messages.reverse().slice(0, limit);
  } catch (error) {
    console.error('Error fetching group messages from cache:', error);
    return [];
  }
};
