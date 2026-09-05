import z from 'zod';

export const CreateDeckSchema = z.object({
  title: z.string().optional(),
  url: z.string().url({ message: 'Invalid URL format' }).optional(),
  prompt: z.string().optional(),
  questionType: z.enum(['Mixed', 'Multiple choice', 'True / False']).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Mixed']).optional(),
  numberOfQuestions: z.enum(['5', '10', '15', '20']).optional(),
  extraOptions: z.array(z.string()).optional(),
});

export type CreateDeckDto = z.infer<typeof CreateDeckSchema>;
