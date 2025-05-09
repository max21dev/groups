import { NDKEvent } from '@nostr-dev-kit/ndk';
import { nanoid } from 'nanoid';
import { useActiveUser, useNdk } from 'nostr-hooks';
import { useRef, useState } from 'react';

import { useChatBottomBar } from '@/features/chats/chat-bottom-bar/hooks';
import { usePollsStore } from '@/features/chats/chat-polls/store';

import { useToast } from '@/shared/components/ui/use-toast';
import { useActiveGroup, useActiveRelay, useLoginModalState, useUploadMedia } from '@/shared/hooks';

type PollType = 'singlechoice' | 'multiplechoice';

type PollOption = {
  id: string;
  text: string;
};

export const useSendChatPoll = (
  relay: string | undefined,
  groupId: string | undefined,
  pubkey: string | undefined,
  onAfterSend?: () => void,
) => {
  const pollQuestionInputRef = useRef<HTMLTextAreaElement>(null);
  const pollOptionInputRef = useRef<HTMLTextAreaElement>(null);

  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOption, setPollOption] = useState('');
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [pollType, setPollType] = useState<PollType>('singlechoice');
  const [endsAt, setEndsAt] = useState<number | null>(null);

  const { polls, setPolls } = usePollsStore();
  const { ndk } = useNdk();
  const { activeUser } = useActiveUser();
  const { activeRelay } = useActiveRelay();
  const { activeGroupId, isCommunity } = useActiveGroup();
  const { openLoginModal } = useLoginModalState();
  const { isMember, isAdmin } = useChatBottomBar();
  const { toast } = useToast();

  const {
    isUploadingMedia: isUploadingQuestionMedia,
    openUploadMediaDialog: openUploadQuestionMediaDialog,
  } = useUploadMedia(setPollQuestion, ['image/*'], pollQuestionInputRef, true);

  const {
    isUploadingMedia: isUploadingOptionMedia,
    openUploadMediaDialog: openUploadOptionMediaDialog,
  } = useUploadMedia(setPollOption, ['image/*'], pollOptionInputRef, true);

  const handleEndsAtChange = (date: Date | undefined) => {
    if (!date) {
      setEndsAt(null);
      return;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (date >= tomorrow) {
      setEndsAt(Math.floor(date.getTime() / 1000));
    } else {
      setEndsAt(null);
    }
  };

  const handleAddOption = () => {
    if (pollOption.trim()) {
      setPollOptions((prev) => [
        ...prev,
        {
          id: nanoid(),
          text: pollOption.trim(),
        },
      ]);
      setPollOption('');
      pollOptionInputRef.current?.focus();
    }
  };

  const handleRemoveOption = (index: number) => {
    setPollOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const publishPollEvent = async (
    content: string,
    options: PollOption[],
    type: PollType,
    expire: number | null,
  ) => {
    if (!ndk || !relay || !groupId || !pubkey) return;

    const tags = [
      ...options.map((option) => ['option', option.id, option.text]),
      ['polltype', type],
      ['relay', relay],
      ['h', groupId],
      ...(expire ? [['endsAt', expire.toString()]] : []),
    ];

    try {
      const pollEvent = new NDKEvent(ndk, {
        kind: 1068,
        tags,
        created_at: Math.floor(Date.now() / 1000),
        content,
        pubkey,
      });

      await pollEvent.publish();
      setPolls([pollEvent, ...polls]);

      toast({
        title: 'Success',
        description: 'Poll created successfully',
        variant: 'default',
      });

      onAfterSend?.();
      setPollQuestion('');
      setPollOption('');
      setPollOptions([]);
      setPollType('singlechoice');
      setEndsAt(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create poll',
        variant: 'destructive',
      });
    }
  };

  const handleCreatePoll = async () => {
    if (!pollQuestion || pollOptions.length === 0 || !endsAt) return;
    await publishPollEvent(pollQuestion, pollOptions, pollType, endsAt);
  };

  return {
    pollQuestionInputRef,
    pollOptionInputRef,

    pollQuestion,
    setPollQuestion,
    pollOption,
    setPollOption,
    pollOptions,
    setPollOptions,
    pollType,
    setPollType,
    endsAt,
    setEndsAt,

    isUploadingQuestionMedia,
    openUploadQuestionMediaDialog,
    isUploadingOptionMedia,
    openUploadOptionMediaDialog,

    handleEndsAtChange,
    handleAddOption,
    handleRemoveOption,
    handleCreatePoll,

    activeUser,
    activeGroupId,
    activeRelay,
    openLoginModal,
    isMember,
    isAdmin,
    isCommunity,
  };
};
