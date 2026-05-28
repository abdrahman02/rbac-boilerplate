"use client";

import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Alert, Button, FormField, Input, PasswordStrengthMeter } from "@/shared/components/ui";
import { getErrorMessage } from "@/shared/lib/api-error";
import { useRegisterForm } from "./useRegisterForm";

// Memoised at module level — avoids re-creating the wrapped component on every render
const PasswordStrengthMeterMemo = memo(PasswordStrengthMeter);

const footer = (
  <>
    Already have an account?{" "}
    <Link href="/login" className="text-primary font-medium no-underline">
      Sign in
    </Link>
  </>
);

export function RegisterForm() {
  const { form, isPending, error, password, onSubmit } = useRegisterForm();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthShell footer={footer}>
      <h1 className="text-[26px] font-semibold tracking-tight m-0">Create your account</h1>
      <p className="mt-1.5 mb-7 text-sm text-muted-foreground">
        You&apos;ll be the workspace owner with full admin permissions.
      </p>

      {error && <Alert message={getErrorMessage(error)} className="mb-4" />}

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <FormField label="Full name" required error={errors.name?.message}>
          <Input
            type="text"
            placeholder="Ada Lovelace"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
        </FormField>

        <FormField label="Work email" required error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            iconLeft={<Mail size={16} />}
            error={errors.email?.message}
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Password"
          required
          error={errors.password?.message}
          hint={!errors.password?.message ? "8+ characters, mix of letters and numbers" : undefined}
        >
          <Input
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            iconLeft={<Lock size={16} />}
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrengthMeterMemo password={password} />
        </FormField>

        <FormField label="Confirm password" required error={errors.confirmPassword?.message}>
          <Input
            type="password"
            placeholder="Re-enter password"
            autoComplete="new-password"
            iconLeft={<Lock size={16} />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </FormField>

        <Button type="submit" isLoading={isPending} fullWidth size="lg" className="mt-1.5">
          Create account
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-1">
          By continuing you accept our Terms and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}
