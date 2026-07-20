import z from 'zod';

export const CreateDeckWithTextSchema = z.object({
  title: z.string(),
  prompt: z.string(),
});

export const CreateDeckWithUrlSchema = z.object({
  title: z.string(),
  url: z.string().url({ message: 'Invalid URL format' }),
  prompt: z.string().optional(),
});

export const CreateDeckWithPdfSchema = z.object({
  title: z.string(),
  prompt: z.string().optional(),
});

export type CreateDeckWithTextDto = z.infer<typeof CreateDeckWithTextSchema>;

export type CreateDeckWithUrlDto = z.infer<typeof CreateDeckWithUrlSchema>;

export type CreateDeckWithPdfDto = z.infer<typeof CreateDeckWithPdfSchema>;
