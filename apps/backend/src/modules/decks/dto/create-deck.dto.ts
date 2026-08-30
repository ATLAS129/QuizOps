import z from 'zod';

export const CreateDeckSchema = z.object({
  title: z.string(),
  url: z.string().url({ message: 'Invalid URL format' }),
  prompt: z.string().optional(),
  questionType: z.enum(['Mixed', 'Multiple choice', 'True / False']).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Mixed']).optional(),
  numberOfQuestions: z.enum(['5', '10', '20', '30']).optional(),
});

export type CreateDeckDto = z.infer<typeof CreateDeckSchema>;
