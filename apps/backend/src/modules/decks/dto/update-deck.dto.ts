import z from 'zod';

export const UpdateDeckSchema = z.object({
  title: z.string().optional(),
  isCompleted: z.boolean().optional(),
  completedAt: z.date().optional(),
  completionDuration: z.number().optional(),
  correctAnswersCompleted: z.number().optional(),
});

export type UpdateDeckDto = z.infer<typeof UpdateDeckSchema>;
