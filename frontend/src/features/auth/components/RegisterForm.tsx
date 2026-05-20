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
import { AuthShell } from './AuthShell'
import { Alert, Button, FormField, Input, MailIcon, LockIcon, PasswordStrengthMeter } from '@/shared/components/ui'

const registerSchema = z
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

type RegisterInput = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')

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

  const footer = (
    <>
      Already have an account?{' '}
      <Link href="/login" className="text-primary font-medium no-underline">
        Sign in
      </Link>
    </>
  )

  const passwordRegister = register('password')

  return (
    <AuthShell footer={footer}>
      <h1 className="text-[26px] font-semibold tracking-tight m-0">Create your account</h1>
      <p className="mt-1.5 mb-7 text-sm text-muted-foreground">
        You&apos;ll be the workspace owner with full admin permissions.
      </p>

      {error && <Alert message={error} className="mb-4" />}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <FormField label="Full name" required error={errors.name?.message}>
          <Input
            type="text"
            placeholder="Ada Lovelace"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
        </FormField>

        <FormField label="Work email" required error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            iconLeft={<MailIcon />}
            error={errors.email?.message}
            {...register('email')}
          />
        </FormField>

        <FormField
          label="Password"
          required
          error={errors.password?.message}
          hint={!errors.password?.message ? '8+ characters, mix of letters and numbers' : undefined}
        >
          <Input
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            iconLeft={<LockIcon />}
            error={errors.password?.message}
            {...passwordRegister}
            onChange={(e) => {
              setPasswordValue(e.target.value)
              passwordRegister.onChange(e)
            }}
          />
          <PasswordStrengthMeter password={passwordValue} />
        </FormField>

        <FormField label="Confirm password" required error={errors.confirmPassword?.message}>
          <Input
            type="password"
            placeholder="Re-enter password"
            autoComplete="new-password"
            iconLeft={<LockIcon />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" isLoading={isLoading} fullWidth size="lg" className="mt-1.5">
          Create account
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-1">
          By continuing you accept our Terms and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  )
}
