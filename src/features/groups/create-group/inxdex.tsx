import { Button } from '@/shared/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog.tsx';
import { Input } from '@/shared/components/ui/input.tsx';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form.tsx';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { useState } from 'react';
import { useGroupCreate } from '@/features/groups/create-group/hooks';

export const CreateGroup = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { metadataForm, onSubmit } = useGroupCreate(setIsDialogOpen);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    metadataForm.handleSubmit(onSubmit)();
  };

  return (
    <>
      <Button variant="default" onClick={() => setIsDialogOpen(true)}>
        Create New Group
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...metadataForm}>
            <form onSubmit={handleSubmit} className="space-y-2 mt-6">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
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
              <DialogFooter>
                <Button variant='outline' type="reset" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
