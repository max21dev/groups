import {
  CalendarIcon,
  ChartNoAxesColumnIcon,
  PlusIcon,
  SendHorizontalIcon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';

import {
  JoinRequestButton,
  LoginButton,
  UploadImageButton,
} from '@/features/chats/chat-bottom-bar/components';

import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import { formatTimestampToDate } from '@/shared/utils';

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
    activeGroupId,
    activeRelay,
    openLoginModal,
    isMember,
    isAdmin,
  } = useSendChatPoll(relay, groupId, pubkey, () => setIsSendPollModalOpen(false));

  if (!activeUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoginButton
          openLoginModal={openLoginModal}
          variant="outline"
          text="To create polls and vote, please login first."
          size="sm"
        />
      </div>
    );
  }

  if (!isMember && !isAdmin) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <JoinRequestButton
          groupId={activeGroupId}
          relay={activeRelay}
          variant="outline"
          text="Join group to create polls and vote."
          size="sm"
        />
      </div>
    );
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
                className="w-full border flex items-center resize-none overflow-x-hidden overflow-y-auto bg-background min-h-20 max-h-36"
              />
              <UploadImageButton
                isUploadingMedia={isUploadingQuestionMedia}
                openUploadMediaDialog={openUploadQuestionMediaDialog}
              />
            </div>

            <div className="flex gap-1 w-full">
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
                  {option.text}
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-start text-left font-normal"
                  >
                    {endsAt ? (
                      formatTimestampToDate(endsAt)
                    ) : (
                      <span className="flex justify-center items-center gap-2">
                        <CalendarIcon size={17} />
                        Expiry date
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    fromDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                    selected={endsAt ? new Date(endsAt * 1000) : undefined}
                    onSelect={(date) => handleEndsAtChange(date)}
                  />
                </PopoverContent>
              </Popover>

              <div className="flex items-center ms-auto gap-2">
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

          <Button
            className="flex ms-auto h-fit w-fit gap-2"
            onClick={handleCreatePoll}
            disabled={!pollQuestion || pollOptions.length === 0 || !endsAt}
          >
            Publish
            <SendHorizontalIcon size={18} />
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
