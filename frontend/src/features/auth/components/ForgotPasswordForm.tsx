'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { z } from 'zod'
import { Button, Input, FormField } from '@/components/ui'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
})

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement forgot password endpoint
      setSuccess(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-600">Check your email for reset instructions.</p>
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Email" error={errors.email?.message}>
        <Input
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="john@example.com"
        />
      </FormField>

      <Button type="submit" isLoading={isLoading} fullWidth>
        Send Reset Link
      </Button>

      <p className="text-center text-sm">
        Remember your password?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  )
}
