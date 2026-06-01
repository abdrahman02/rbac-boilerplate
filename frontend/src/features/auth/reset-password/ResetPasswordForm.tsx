"use client";

import { Check, Lock } from "lucide-react";
import { memo } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { AuthStatusCard } from "@/features/auth/components/AuthStatusCard";
import { BackToSignInLink } from "@/features/auth/components/BackToSignInLink";
import { Alert, Button, FormField, Input, PasswordStrengthMeter } from "@/shared/components/ui";
import { useResetPasswordForm } from "./useResetPasswordForm";

// Memoised at module level to avoid re-creating the wrapped component on every render
const PasswordStrengthMeterMemo = memo(PasswordStrengthMeter);

// --- Main component (pure JSX — no useState, no useRouter, no async) ---

export function ResetPasswordForm() {
  const { form, isLoading, done, hasToken, password, onSubmit } = useResetPasswordForm();

  const {
    register,
    formState: { errors },
  } = form;

  // Render nothing while redirect to /forgot-password is in-flight
  if (!hasToken) return null;

  if (done) {
    return (
      <AuthShell footer={<BackToSignInLink />}>
        <AuthStatusCard
          variant="success"
          icon={<Check size={16} />}
          title="Password updated"
          description="You can now sign in with your new password."
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell footer={<BackToSignInLink />}>
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
