'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Button, Input, FormField } from '@/components/ui'

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement password reset endpoint
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="New Password" error={errors.password?.message}>
        <Input
          type="password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="••••••••"
        />
      </FormField>

      <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
        <Input
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          placeholder="••••••••"
        />
      </FormField>

      <Button type="submit" isLoading={isLoading} fullWidth>
        Reset Password
      </Button>
    </form>
  )
}
