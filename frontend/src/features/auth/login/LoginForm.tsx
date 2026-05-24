'use client'

import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { getErrorMessage } from '@/shared/lib/api-error'
import { AuthShell } from '@/features/auth/components/AuthShell'
import {
  Alert,
  Button,
  Divider,
  FormField,
  Input,
} from '@/shared/components/ui'
import { useLoginForm } from './useLoginForm'

/**
 * Pure JSX login form component.
 * All state, routing, and mutation logic are encapsulated in useLoginForm.
 */
export function LoginForm() {
  const { form, isPending, error, showPassword, toggleShowPassword, onSubmit } = useLoginForm()

  const {
    register,
    formState: { errors },
  } = form

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

      {error && <Alert message={getErrorMessage(error)} className="mb-4" />}

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

        <FormField
          label="Password"
          labelRight={
            <Link
              href="/forgot-password"
              className="text-[12.5px] text-primary font-medium no-underline"
            >
              Forgot?
            </Link>
          }
          required
          error={errors.password?.message}
        >
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="current-password"
            iconLeft={<Lock size={16} />}
            iconRight={
              <Button
                type="button"
                variant="ghost"
                size="iconOnly"
                onClick={toggleShowPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="text-muted-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            }
            error={errors.password?.message}
            {...register('password')}
          />
        </FormField>

        <Button type="submit" isLoading={isPending} fullWidth size="lg">
          Sign in
        </Button>
      </form>

      <Divider label="OR CONTINUE WITH" />

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline">SSO / SAML</Button>
        <Button type="button" variant="outline">Google Workspace</Button>
      </div>
    </AuthShell>
  )
}
