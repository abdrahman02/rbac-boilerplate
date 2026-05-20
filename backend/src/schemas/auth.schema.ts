import { z } from 'zod'
import { emailField } from './shared.js'

export const registerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: emailField,
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and a number',
    ),
})

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
