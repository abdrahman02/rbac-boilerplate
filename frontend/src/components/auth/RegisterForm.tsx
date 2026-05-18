'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { z } from 'zod'
import { apiClient } from '@/shared/lib/api-client'
import { getErrorMessage } from '@/shared/lib/api-error'
import { Button, Input, FormField } from '@/components/ui'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterInput = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      })
      queryClient.setQueryData(['auth', 'me'], response.data.data)
      router.push('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Name" error={errors.name?.message}>
        <Input
          type="text"
          {...register('name')}
          error={errors.name?.message}
          placeholder="John Doe"
        />
      </FormField>

      <FormField label="Email" error={errors.email?.message}>
        <Input
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="john@example.com"
        />
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" isLoading={isLoading} fullWidth>
        Create Account
      </Button>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  )
}
