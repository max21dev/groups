import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Group } from '@/shared/types';

export const metadataFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  picture: z.union([
    z.string().url({
      message: 'Please enter a valid URL.',
    }),
    z.literal(''),
  ]),
  about: z.string().optional(),
});

export const useMetadataForm = (group: Group | undefined) =>
  useForm<z.infer<typeof metadataFormSchema>>({
    resolver: zodResolver(metadataFormSchema),
    defaultValues: {
      name: group?.name ?? '',
      about: group?.about ?? '',
      picture: group?.picture ?? '',
    },
  });

export const groupStatusSchema = z.object({
  privacy: z.enum(['public', 'private'], {
    errorMap: () => ({ message: 'Privacy must be either "public" or "private".' }),
  }),
  type: z.enum(['open', 'closed'], {
    errorMap: () => ({ message: 'Type must be either "open" or "closed".' }),
  }),
});

export const useGroupStatusForm = (group: Group | undefined) =>
  useForm<z.infer<typeof groupStatusSchema>>({
    resolver: zodResolver(groupStatusSchema),
    defaultValues: {
      privacy: group?.privacy ?? 'public',
      type: group?.type ?? 'open',
    },
  });