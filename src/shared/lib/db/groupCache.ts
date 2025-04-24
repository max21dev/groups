import { Nip29GroupChat } from 'nostr-hooks/nip29';
import db, { CachedGroupMessage } from './index';

export const saveGroupMessage = async (message: Nip29GroupChat, groupId: string): Promise<void> => {
  const cachedMessage: CachedGroupMessage = { ...message, groupId };
  try {
    await db.groupMessages.put(cachedMessage);

    await cleanupGroupMessages(groupId);

    await cleanupAllMessages();
  } catch (error) {
    console.error('Error saving or cleaning up group messages:', error);
  }
};

const cleanupGroupMessages = async (groupId: string): Promise<void> => {
  try {
    const count = await db.groupMessages.where('groupId').equals(groupId).count();

    if (count > db.config.maxMessagesPerGroup) {
      const messagesToRemove = await db.groupMessages
        .where('groupId')
        .equals(groupId)
        .sortBy('timestamp')
        .then((msgs) => msgs.slice(0, count - db.config.maxMessagesPerGroup));

      await db.transaction('rw', db.groupMessages, async () => {
        for (const msg of messagesToRemove) {
          await db.groupMessages.delete(msg.id);
        }
      });
    }
  } catch (error) {
    console.error('Error cleaning up group messages:', error);
  }
};

const cleanupAllMessages = async (): Promise<void> => {
  try {
    const totalCount = await db.groupMessages.count();

    if (totalCount > db.config.maxTotalMessages) {
      const messagesToRemove = await db.groupMessages
        .orderBy('timestamp')
        .limit(totalCount - db.config.maxTotalMessages)
        .toArray();

      await db.transaction('rw', db.groupMessages, async () => {
        for (const msg of messagesToRemove) {
          await db.groupMessages.delete(msg.id);
        }
      });
    }
  } catch (error) {
    console.error('Error cleaning up all messages:', error);
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
