import z from 'zod';

export const SignupUserSchema = z
  .object({
    name: z.string().max(128),
    email: z.email(),
    password: z.string().min(8).max(64),
    repeatPassword: z.string().min(8).max(64),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });

export type SignupUserDto = z.infer<typeof SignupUserSchema>;
