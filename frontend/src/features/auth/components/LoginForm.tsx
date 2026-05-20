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
import { Alert, Button, Divider, FormField, Input, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from '@/shared/components/ui'

const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginInput = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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

  const footer = (
    <>
      Don&apos;t have an account?{' '}
      <Link href="/register" className="text-primary font-medium no-underline">
        Create one
      </Link>
    </>
  )

  return (
    <AuthShell footer={footer}>
      <h1 className="text-[26px] font-semibold tracking-tight m-0">Welcome back</h1>
      <p className="mt-1.5 mb-7 text-sm text-muted-foreground">
        Sign in to your RBAC workspace.
      </p>

      {error && <Alert message={error} className="mb-4" />}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <FormField label="Email" required error={errors.email?.message}>
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
          label={
            <span className="flex justify-between w-full">
              <span>Password</span>
              <Link
                href="/forgot-password"
                className="text-[12.5px] text-primary font-medium no-underline"
              >
                Forgot?
              </Link>
            </span>
          }
          required
          error={errors.password?.message}
        >
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="current-password"
            iconLeft={<LockIcon />}
            iconRight={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="border-0 bg-transparent text-muted-foreground p-1 cursor-pointer flex items-center"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />
        </FormField>

        <Button type="submit" isLoading={isLoading} fullWidth size="lg">
          Sign in
        </Button>
      </form>

      <Divider />

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline">SSO / SAML</Button>
        <Button type="button" variant="outline">Google Workspace</Button>
      </div>
    </AuthShell>
  )
}
