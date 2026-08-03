import z from 'zod';

export const UpdateDeckSchema = z.object({
  title: z.string(),
  isCompleted: z.boolean(),
});

export type UpdateDeckDto = z.infer<typeof UpdateDeckSchema>;
