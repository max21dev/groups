import { ArrowLeft } from 'lucide-react';
import { useActiveUser, useProfile } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ChatBottomBar } from '@/features/chats';
import { ActiveUserInfo } from '@/features/users';
import { UserInfo } from '@/features/users/user-info';
import { Sidebar } from '@/shared/components/sidebar';
import { useStore } from '@/shared/store';
import { cn } from '@/shared/utils';
import { Button } from '@/shared/components/ui/button.tsx';

export function UserPage() {
  const [activeDmId] = useState<string | null>(null);
  const { user: npub } = useParams();
  const { profile } = useProfile({ npub });
  const { activeUser } = useActiveUser();
  const navigate = useNavigate();
  const isCollapsed = useStore((state) => state.isCollapsed);

  let pubkey = '';
  try {
    const decoded = npub ? nip19.decode(npub) : { data: '' };
    pubkey = typeof decoded.data === 'string' ? decoded.data : '';
  } catch (error) {
    console.error('Failed to decode npub:', error);
    pubkey = '';
  }
  return (
    <div className="w-full">
      {npub && pubkey ? (
        !activeUser ? (
          <div className="p-4 mx-auto w-full sm:w-3/5 flex items-center justify-center flex-col gap-4">
            <span
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-gray-200 dark:bg-slate-800 dark:text-white w-fit self-start px-2 py-1 rounded cursor-pointer"
            >
              <ArrowLeft className="w-4" /> Back To Home
            </span>
            <UserInfo profile={profile} pubkey={pubkey} npub={npub} className="shadow rounded-lg" />
          </div>
        ) : (
          <div className="flex justify-between w-full h-full overflow-hidden">
            <Sidebar className={cn('sm:block max-w-full w-full', activeDmId && 'max-sm:hidden')}>
              <div className="flex flex-col w-full h-full">
                <div className="p-2">
                  <div
                    className={cn(
                      'flex gap-1 w-full',
                      isCollapsed && 'flex-col',
                      'max-sm:flex-row',
                    )}
                  >
                    <Button
                      variant="outline"
                      onClick={() => navigate(-1)}
                      className=" w-full h-9 bg-background border border-input px-4 rounded-md shadow-sm cursor-pointer"
                    >
                      <ArrowLeft className="w-4" /> Back To Home
                    </Button>
                  </div>
                </div>

                <div
                  className={cn(
                    'p-2 flex flex-col h-full gap-4 overflow-y-hidden hover:overflow-y-auto max-sm:overflow-y-auto',
                  )}
                ></div>

                <div className="mt-auto w-full">
                  <ActiveUserInfo />
                </div>
              </div>
            </Sidebar>
            <div className={cn('w-2/5', 'sm:block', !activeDmId && 'max-sm:hidden')}>
              <div className="flex flex-col w-full h-full">
                {!activeDmId && (
                  <>
                    <div className="flex flex-col mt-auto items-center gap-2 p-2">
                      <ChatBottomBar />
                    </div>
                  </>
                )}
              </div>
            </div>
            <UserInfo
              profile={profile}
              pubkey={pubkey}
              npub={npub}
              className="w-1/5 h-screen overflow-y-scroll border-l border-gray-200 dark:border-slate-800"
            />
          </div>
        )
      ) : (
        <div className="p-4 mx-auto w-full sm:w-3/5 flex items-center justify-center flex-col gap-4">
          <span
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-200 dark:bg-slate-800 dark:text-white w-fit self-start px-2 py-1 rounded cursor-pointer"
          >
            <ArrowLeft className="w-4" /> Back
          </span>
          <p>User Not Found</p>
        </div>
      )}
    </div>
  );
}