import { z } from 'zod'
import { emailField } from './shared.js'

const passwordField = z
  .string()
  .min(8, 'At least 8 characters')
  .max(100)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and a number',
  )

export const registerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: emailField,
  password: passwordField,
})

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1),
})

export const updateMeSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim().optional(),
    email: emailField.optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: 'At least one field (name or email) is required',
  })

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: passwordField,
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateMeInput = z.infer<typeof updateMeSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
