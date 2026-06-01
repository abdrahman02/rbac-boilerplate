"use client";

import { Check, Mail } from "lucide-react";
import { memo } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { AuthStatusCard } from "@/features/auth/components/AuthStatusCard";
import { BackToSignInLink } from "@/features/auth/components/BackToSignInLink";
import { Button, FormField, Input } from "@/shared/components/ui";
import { useForgotPasswordForm } from "./useForgotPasswordForm";

interface SuccessStateProps {
  email: string;
  onRetry: () => void;
}

const SuccessState = memo(function SuccessState({ email, onRetry }: SuccessStateProps) {
  return (
    <AuthStatusCard
      variant="success"
      icon={<Check size={16} />}
      title="Check your inbox"
      description={
        <>
          We&apos;ve sent a reset link to <b className="text-foreground font-semibold">{email}</b>. The link expires in
          30 minutes.
        </>
      }
    >
      <Button type="button" variant="outline" onClick={onRetry}>
        Try a different email
      </Button>
    </AuthStatusCard>
  );
});

export function ForgotPasswordForm() {
  const { form, isLoading, success, submittedEmail, onRetry, onSubmit } = useForgotPasswordForm();

  const {
    register,
    formState: { errors },
  } = form;

  if (success) {
    return (
      <AuthShell footer={<BackToSignInLink />}>
        <SuccessState email={submittedEmail} onRetry={onRetry} />
      </AuthShell>
    );
  }

  return (
    <AuthShell footer={<BackToSignInLink />}>
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
            {...register("email")}
          />
        </FormField>

        <Button type="submit" isLoading={isLoading} fullWidth size="lg">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
