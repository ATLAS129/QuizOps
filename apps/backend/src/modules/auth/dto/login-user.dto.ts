import z from 'zod';

export const LoginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(64),
});

export type LoginUserDto = z.infer<typeof LoginUserSchema>;
