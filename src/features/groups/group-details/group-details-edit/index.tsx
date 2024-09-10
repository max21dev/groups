import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/shared/components/ui/dialog';

import { Group } from '@/shared/types';
import { useGroupDetailsEdit } from './hooks';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/shared/components/ui/tabs';

type Props = {
  group: Group | undefined;
  setEditMode: Dispatch<SetStateAction<boolean>>;
};

export const GroupDetailsEdit = ({ group, setEditMode }: Props) => {
  const { metadataForm, onSubmit } = useGroupDetailsEdit({ group, setEditMode });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    metadataForm.handleSubmit(onSubmit)();
    setIsDialogOpen(false);
  };

  return (
    <>
      <Tabs defaultValue="metadata" className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>
        <TabsContent value="metadata">
          <Form {...metadataForm}>
            <form onSubmit={handleSubmit} className="space-y-2 mt-6">
              <FormField
                control={metadataForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group name:</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Group Name" {...field} />
                    </FormControl>
                    <FormDescription>Enter the name of the group.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={metadataForm.control}
                name="picture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Picture:</FormLabel>
                    <FormControl>
                      <Input placeholder="Picture URL" {...field} />
                    </FormControl>
                    <FormDescription>Enter the picture URL of the group.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={metadataForm.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About:</FormLabel>
                    <FormControl>
                      <Textarea placeholder="About group ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="status">Coming soon!!!</TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to update group metadata?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
