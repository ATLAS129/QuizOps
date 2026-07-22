import z from 'zod';

export const UpdateUserSchema = z.object({
  email: z.email().optional(),
  name: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
