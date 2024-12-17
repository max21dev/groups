import { ArrowLeft } from 'lucide-react';
import { useProfile } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';
import { useNavigate, useParams } from 'react-router-dom';

import { UserInfo } from '@/features/users/user-info';

export function UserPage() {
  const { user: npub } = useParams();
  const { profile } = useProfile({ npub });
  const navigate = useNavigate();

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
      <div className="p-4 mx-auto w-full sm:w-3/5 flex items-center justify-center flex-col gap-4">
        <span
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-200 dark:bg-slate-800 dark:text-white w-fit self-start px-2 py-1 rounded cursor-pointer"
        >
          <ArrowLeft className="w-4" /> Back
        </span>
        {npub && pubkey ? (
          <UserInfo profile={profile} pubkey={pubkey} npub={npub} />
        ) : (
          <p>User Not Found</p>
        )}
      </div>
    </div>
  );
}
