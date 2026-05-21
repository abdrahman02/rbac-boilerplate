import { z } from 'zod'

/**
 * Zod schema for the registration form.
 * Validates name, email, password, and confirmPassword fields.
 * The refine step ensures both password fields match.
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email({ message: 'Invalid email address' }),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
