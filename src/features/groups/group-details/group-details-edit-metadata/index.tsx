import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form.tsx';

import { Button } from '@/shared/components/ui/button.tsx';
import { Input } from '@/shared/components/ui/input.tsx';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { UseFormReturn } from 'react-hook-form';

export const GroupDetailsEditMetadata = ({
  metadataForm,
  handleSubmitMetadata,
}: {
  metadataForm: UseFormReturn<{ name: string; picture: string; about?: string | undefined }>;
  handleSubmitMetadata: (event: React.FormEvent) => void;
}) => {
  return (
    <>
      <Form {...metadataForm}>
        <form onSubmit={handleSubmitMetadata} className="space-y-2 mt-6">
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
    </>
  );
};
