import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { UseFormReturn } from 'react-hook-form';

export const GroupDetailsEditStatus = ({
  groupStatusForm,
  handleSubmitStatus,
}: {
  groupStatusForm: UseFormReturn<
    { privacy: 'public' | 'private'; type: 'open' | 'closed' }
  >,
  handleSubmitStatus: (event: React.FormEvent) => void;
}) => {
  return (
    <>
      <Form {...groupStatusForm}>
        <form onSubmit={handleSubmitStatus} className="space-y-2 mt-6">
          <FormField
            control={groupStatusForm.control}
            name="privacy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Privacy:</FormLabel>
                <Select {...field} onValueChange={field.onChange} value={field.value}>
                  <FormControl></FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Set the privacy of the group." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={groupStatusForm.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Type:</FormLabel>
                <Select {...field} onValueChange={field.onChange} value={field.value}>
                  <FormControl></FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Set the type of the group." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
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
