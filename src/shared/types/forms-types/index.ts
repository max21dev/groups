import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Group } from '@/shared/types';

export const metadataFormSchema = z.object({
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

export const useMetadataForm = (group: Group | undefined) =>
  useForm<z.infer<typeof metadataFormSchema>>({
    resolver: zodResolver(metadataFormSchema),
    defaultValues: {
      name: group?.name ?? undefined,
      about: group?.about ?? undefined,
      picture: group?.picture ?? undefined,
    },
  });
