import z from 'zod';

export const CreateDeckSchema = z.object({
  title: z.string(),
  url: z.string().url({ message: 'Invalid URL format' }),
  prompt: z.string().optional(),
});

export type CreateDeckDto = z.infer<typeof CreateDeckSchema>;
