import { ChartNoAxesColumnIcon, PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { SendButton, UploadImageButton } from '@/features/chats/chat-bottom-bar/components';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';

import { useSendChatPoll } from './hooks';

export const SendChatPoll = ({
  relay,
  groupId,
  pubkey,
}: {
  relay: string | undefined;
  groupId: string | undefined;
  pubkey: string | undefined;
}) => {
  const [isSendPollModalOpen, setIsSendPollModalOpen] = useState(false);

  const {
    pollQuestionInputRef,
    pollOptionInputRef,
    pollQuestion,
    setPollQuestion,
    pollOption,
    setPollOption,
    pollOptions,
    pollType,
    setPollType,
    endsAt,
    isUploadingQuestionMedia,
    openUploadQuestionMediaDialog,
    isUploadingOptionMedia,
    openUploadOptionMediaDialog,
    handleEndsAtChange,
    handleAddOption,
    handleRemoveOption,
    handleCreatePoll,
    activeUser,
    isMember,
    isAdmin,
  } = useSendChatPoll(relay, groupId, pubkey, () => setIsSendPollModalOpen(false));

  if (!activeUser || (!isMember && !isAdmin)) {
    return null;
  }

  return (
    <div>
      <Button
        variant="outline"
        className="flex justify-center items-center gap-1 self-stretch"
        onClick={() => setIsSendPollModalOpen(true)}
      >
        <ChartNoAxesColumnIcon size={17} />
        Add New Poll
      </Button>

      <Dialog open={isSendPollModalOpen} onOpenChange={() => setIsSendPollModalOpen(false)}>
        <DialogContent className="[&>button]:right-6 [&>button]:top-6 max-h-[80vh] overflow-y-auto [overflow-wrap:anywhere]">
          <DialogHeader>
            <DialogTitle>New Poll</DialogTitle>
          </DialogHeader>

          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex gap-1">
              <Textarea
                autoComplete="off"
                ref={pollQuestionInputRef}
                placeholder="Poll question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full border flex items-center resize-none overflow-x-hidden overflow-y-auto bg-background max-h-24"
              />
              <UploadImageButton
                isUploadingMedia={isUploadingQuestionMedia}
                openUploadMediaDialog={openUploadQuestionMediaDialog}
              />
            </div>

            <div className="flex gap-2 w-full">
              <div className="w-full flex gap-1">
                <Textarea
                  ref={pollOptionInputRef}
                  placeholder="New option..."
                  value={pollOption}
                  onChange={(e) => setPollOption(e.target.value)}
                  className="w-full border flex items-center resize-none overflow-x-hidden overflow-y-auto bg-background max-h-24"
                />
                <UploadImageButton
                  isUploadingMedia={isUploadingOptionMedia}
                  openUploadMediaDialog={openUploadOptionMediaDialog}
                />
              </div>

              <Button
                onClick={handleAddOption}
                className="w-10 p-0"
                variant="outline"
                disabled={!pollOption.trim()}
              >
                <PlusIcon size={17} />
              </Button>
            </div>

            <ul className="m-0 space-y-3">
              {pollOptions.map((option, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center min-h-8 border rounded-md ps-3 relative"
                >
                  {option}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-6 h-6 p-0 rounded-full absolute -top-2 -right-2"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <XIcon size={17} />
                  </Button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 w-full">
              <div className="flex flex-col gap-2">
                <Input
                  className="cursor-pointer"
                  type="date"
                  placeholder="Expiry date"
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  onChange={handleEndsAtChange}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={pollType === 'multiplechoice'}
                  onCheckedChange={(checked) =>
                    setPollType(checked ? 'multiplechoice' : 'singlechoice')
                  }
                />
                <span>Multiple choices</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end h-fit [&_*]:hover:bg-transparent [&_*]:w-fit [&_*]:h-fit">
            <SendButton
              handleSend={handleCreatePoll}
              disabled={!pollQuestion || pollOptions.length === 0 || !endsAt}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
