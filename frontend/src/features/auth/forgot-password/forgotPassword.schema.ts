import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
