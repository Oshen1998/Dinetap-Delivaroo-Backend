import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2).max(40),
  phoneNumber: z.string().min(0).max(10).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const userUpdateSchema = z
  .object({
    name: z.string().min(2).max(40).optional(),
    phoneNumber: z.string().min(0).max(10).optional(),
    email: z.string().email().optional(),
  })
  .refine(data => data.name || data.phoneNumber || data.email, {
    message:
      'At least one of the fields (name, phoneNumber, or email) is required.',
    path: ['name', 'phoneNumber', 'email'],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
