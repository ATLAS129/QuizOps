import z from 'zod';

export const CreateDeckSchema = z.object({
  title: z.string(),
  prompt: z.string(),
});

export type CreateDeckDto = z.infer<typeof CreateDeckSchema>;
