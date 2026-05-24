'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Check, ChevronLeft, Mail } from 'lucide-react'
import { AuthShell } from '@/features/auth/components/AuthShell'
import {
  Button,
  FormField,
  Input,
} from '@/shared/components/ui'
import { useForgotPasswordForm } from './useForgotPasswordForm'

// --- SuccessState sub-component ---

interface SuccessStateProps {
  email: string
  onRetry: () => void
}

const SuccessState = memo(function SuccessState({ email, onRetry }: SuccessStateProps) {
  return (
    <div className="animate-scale-in">
      <div className="w-14 h-14 rounded-2xl bg-success/12 text-success border border-success/22 inline-flex items-center justify-center mb-[18px]">
        <Check size={26} />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight m-0">Check your inbox</h1>
      <p className="mt-2 mb-6 text-sm text-muted-foreground leading-relaxed">
        We&apos;ve sent a reset link to{' '}
        <b className="text-foreground font-semibold">{email}</b>. The link expires in 30 minutes.
      </p>

      <Button type="button" variant="outline" onClick={onRetry}>
        Try a different email
      </Button>
    </div>
  )
})

// --- Main component ---

const backLink = (
  <Link
    href="/login"
    className="text-primary font-medium no-underline inline-flex items-center gap-1"
  >
    <ChevronLeft size={14} />
    Back to sign in
  </Link>
)

export function ForgotPasswordForm() {
  const { form, isLoading, success, submittedEmail, onRetry, onSubmit } = useForgotPasswordForm()

  const {
    register,
    formState: { errors },
  } = form

  if (success) {
    return (
      <AuthShell footer={backLink}>
        <SuccessState email={submittedEmail} onRetry={onRetry} />
      </AuthShell>
    )
  }

  return (
    <AuthShell footer={backLink}>
      <h1 className="text-[26px] font-semibold tracking-tight m-0">Forgot your password?</h1>
      <p className="mt-1.5 mb-7 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <FormField label="Email" required error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            iconLeft={<Mail size={16} />}
            error={errors.email?.message}
            {...register('email')}
          />
        </FormField>

        <Button type="submit" isLoading={isLoading} fullWidth size="lg">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  )
}
