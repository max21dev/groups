import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Group, GroupMetadata } from '@/shared/types';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { useGroupDetails } from '@/features/groups/group-details/hooks';
import React from 'react';

const formSchema = z.object({
  name: z.string().min(5, {
    message: 'Username must be at least 5 characters.',
  }),
  picture: z.union([
    z.string().url({
      message: 'Please enter a valid URL.',
    }),
    z.literal(''),
  ]),
  about: z.string().optional(),
});

export const GroupDetailsEdit = ({
  group,
  setEditMode,
}: {
  group: Group | undefined;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { updateGroupMetadata } = useGroupDetails({ groupId: group?.id });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: group?.name,
      about: group?.about,
      picture: group?.picture,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedGroup: GroupMetadata = {
      id: group?.id,
      name: values.name,
      picture: values.picture,
      about: values.about,
    } as GroupMetadata;
    updateGroupMetadata(updatedGroup);
    setEditMode(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Group Name" {...field} />
              </FormControl>
              <FormDescription>Enter the name of the group.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Picture</FormLabel>
              <FormControl>
                <Input placeholder="Picture URL" {...field} />
              </FormControl>
              <FormDescription>Enter the picture URL of the group.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>about</FormLabel>
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
  );
};
