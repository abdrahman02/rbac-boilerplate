'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { z } from 'zod'
import { apiClient } from '@/lib/api-client'
import { getErrorMessage } from '@/lib/api-error'
import { Button, Input, FormField } from '@/components/ui'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginInput = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/auth/login', data)
      queryClient.setQueryData(['auth', 'me'], response.data.data)
      router.push('/')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
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

      <FormField label="Password" error={errors.password?.message}>
        <Input
          type="password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="••••••••"
        />
      </FormField>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" isLoading={isLoading} fullWidth>
        Sign In
      </Button>

      <p className="text-center text-sm">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  )
}
