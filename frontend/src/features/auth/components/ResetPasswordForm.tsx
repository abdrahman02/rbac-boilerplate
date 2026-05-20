'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { AuthShell } from './AuthShell'
import { Alert, Button, FormField, Input, CheckIcon, LockIcon, PasswordStrengthMeter } from '@/shared/components/ui'

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
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Implement password reset endpoint
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const footer = (
    <Link href="/login" className="text-primary font-medium no-underline">
      Back to sign in
    </Link>
  )

  if (done) {
    return (
      <AuthShell footer={footer}>
        <SuccessState onContinue={() => router.push('/login')} />
      </AuthShell>
    )
  }

  const passwordRegister = register('password')

  return (
    <AuthShell footer={footer}>
      <h1 className="text-[26px] font-semibold tracking-tight m-0">Set a new password</h1>
      <p className="mt-1.5 mb-7 text-sm text-muted-foreground">
        Choose a password you haven&apos;t used before.
      </p>

      {error && <Alert message={error} className="mb-4" />}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <FormField label="New password" required error={errors.password?.message}>
          <Input
            type="password"
            placeholder="Enter new password"
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

        <FormField label="Confirm new password" required error={errors.confirmPassword?.message}>
          <Input
            type="password"
            placeholder="Re-enter new password"
            autoComplete="new-password"
            iconLeft={<LockIcon />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" isLoading={isLoading} fullWidth size="lg">
          Update password
        </Button>
      </form>
    </AuthShell>
  )
}

interface SuccessStateProps {
  onContinue: () => void
}

function SuccessState({ onContinue }: SuccessStateProps) {
  return (
    <div className="animate-scale-in">
      <div className="w-14 h-14 rounded-2xl bg-success/12 text-success border border-success/22 inline-flex items-center justify-center mb-[18px]">
        <CheckIcon size={26} />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight m-0">Password updated</h1>
      <p className="mt-2 mb-6 text-sm text-muted-foreground leading-relaxed">
        You can now sign in with your new password.
      </p>

      <Button type="button" size="lg" onClick={onContinue}>
        Continue to sign in
      </Button>
    </div>
  )
}
