import { EyeClosedIcon, EyeIcon, LockIcon, LockOpenIcon } from 'lucide-react';
import { editGroupMetadata, Nip29GroupMetadata } from 'nostr-hooks/nip29';
import { useCallback, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/components/ui/use-toast';

export type GroupMetadataFormProps = {
  groupId: string | undefined;
  initialMetadata?: Partial<Nip29GroupMetadata>;
};

export const GroupMetadataForm = ({ initialMetadata, groupId }: GroupMetadataFormProps) => {
  const [name, setName] = useState(initialMetadata?.name ?? '');
  const [picture, setPicture] = useState(initialMetadata?.picture ?? '');
  const [about, setAbout] = useState(initialMetadata?.about ?? '');
  const [isPublic, setIsPublic] = useState(initialMetadata?.isPublic ?? true);
  const [isOpen, setIsOpen] = useState(initialMetadata?.isOpen ?? true);

  const { toast } = useToast();

  const handleSubmit = useCallback(() => {
    groupId &&
      editGroupMetadata({
        groupId,
        metadata: { about, isOpen, isPublic, name, picture },
        onSuccess: () => {
          toast({ title: 'Success', description: 'Group metadata updated' });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to update metadata',
            variant: 'destructive',
          });
        },
      });
  }, [about, groupId, isPublic, isOpen, name, picture, toast]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="group-name">Name:</Label>
          <Input
            id="group-name"
            type="text"
            placeholder="The Cool Folks"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="group-picture">Picture (URL):</Label>
          <Input
            id="group-picture"
            type="text"
            placeholder="https://example.com/picture.jpg"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="group-about">About:</Label>
          <Input
            id="group-about"
            type="text"
            placeholder="We are the cool folks!"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Button
            className="w-full gap-1"
            onClick={() => setIsPublic((prev) => !prev)}
            variant="outline"
          >
            {isPublic ? <EyeIcon className="w-4 h-4" /> : <EyeClosedIcon className="w-4 h-4" />}
            {isPublic ? 'Public' : 'Private'}
          </Button>
        </div>

        <div>
          <Button
            className="w-full gap-1"
            onClick={() => setIsOpen((prev) => !prev)}
            variant="outline"
          >
            {isOpen ? <LockOpenIcon className="w-4 h-4" /> : <LockIcon className="w-4 h-4" />}
            {isOpen ? 'Open' : 'Closed'}
          </Button>
        </div>
      </div>

      <div>
        <Button size="lg" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};
