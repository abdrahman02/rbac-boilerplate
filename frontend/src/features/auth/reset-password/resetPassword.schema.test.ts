import { describe, it, expect } from 'vitest'
import { resetPasswordSchema } from './resetPassword.schema'

const validData = { password: 'newpassword123', confirmPassword: 'newpassword123' }

describe('resetPasswordSchema', () => {
  it('accepts matching passwords of 8+ characters', () => {
    expect(resetPasswordSchema.safeParse(validData).success).toBe(true)
  })

  it('rejects password shorter than 8 characters', () => {
    const result = resetPasswordSchema.safeParse({ password: 'short', confirmPassword: 'short' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Password must be at least 8 characters')
  })

  it('rejects when passwords do not match', () => {
    const result = resetPasswordSchema.safeParse({ ...validData, confirmPassword: 'different' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Passwords do not match')
  })
})
