"use client";

import { Check, Lock } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Alert, Button, FormField, Input, PasswordStrengthMeter } from "@/shared/components/ui";
import { useResetPasswordForm } from "./useResetPasswordForm";

// Memoised at module level to avoid re-creating the wrapped component on every render
const PasswordStrengthMeterMemo = memo(PasswordStrengthMeter);

// --- SuccessState sub-component ---

interface SuccessStateProps {
  onContinue: () => void;
}

const SuccessState = memo(function SuccessState({ onContinue }: SuccessStateProps) {
  return (
    <div className="animate-scale-in">
      <div className="w-14 h-14 rounded-2xl bg-success/12 text-success border border-success/22 inline-flex items-center justify-center mb-[18px]">
        <Check size={26} />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight m-0">Password updated</h1>
      <p className="mt-2 mb-6 text-sm text-muted-foreground leading-relaxed">
        You can now sign in with your new password.
      </p>

      <Button type="button" size="lg" onClick={onContinue}>
        Continue to sign in
      </Button>
    </div>
  );
});

// --- Shared footer link ---

const footer = (
  <Link href="/login" className="text-primary font-medium no-underline">
    Back to sign in
  </Link>
);

// --- Main component (pure JSX — no useState, no useRouter, no async) ---

export function ResetPasswordForm() {
  const { form, isLoading, done, hasToken, password, onContinue, onSubmit } = useResetPasswordForm();

  const {
    register,
    formState: { errors },
  } = form;

  // Render nothing while redirect to /forgot-password is in-flight
  if (!hasToken) return null;

  if (done) {
    return (
      <AuthShell footer={footer}>
        <SuccessState onContinue={onContinue} />
      </AuthShell>
    );
  }

  return (
    <AuthShell footer={footer}>
      <h1 className="text-[26px] font-semibold tracking-tight m-0">Set a new password</h1>
      <p className="mt-1.5 mb-7 text-sm text-muted-foreground">Choose a password you haven&apos;t used before.</p>

      {errors.root?.message && <Alert message={errors.root.message} className="mb-4" />}

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <FormField label="New password" required error={errors.password?.message}>
          <Input
            type="password"
            placeholder="Enter new password"
            autoComplete="new-password"
            iconLeft={<Lock size={16} />}
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrengthMeterMemo password={password} />
        </FormField>

        <FormField label="Confirm new password" required error={errors.confirmPassword?.message}>
          <Input
            type="password"
            placeholder="Re-enter new password"
            autoComplete="new-password"
            iconLeft={<Lock size={16} />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </FormField>

        <Button type="submit" isLoading={isLoading} fullWidth size="lg">
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
