"use client";

import { useMutation } from "@tanstack/react-query";
import { Check, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button } from "@/shared/components/ui";
import { apiClient } from "@/shared/lib/api-client";
import { getErrorMessage } from "@/shared/lib/api-error";

const backLink = (
  <Link href="/login" className="text-primary font-medium no-underline inline-flex items-center gap-1">
    <ChevronLeft size={14} />
    Back to sign in
  </Link>
);

export function VerifyEmailSent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [cooldown, setCooldown] = useState(0);

  const {
    mutate: resend,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: () => apiClient.post("/auth/resend-verification", { email }),
    onSuccess: () => setCooldown(60),
  });

  // Tick the cooldown down every second
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const canResend = email !== "" && !isPending && cooldown === 0;

  return (
    <AuthShell footer={backLink}>
      <div className="animate-scale-in mt-3">
        <h1 className="text-2xl font-semibold tracking-tight m-0 inline-flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-success/12 text-success border border-success/22 inline-flex items-center justify-center">
            <Check size={16} />
          </div>
          Check your inbox
        </h1>
        <p className="mt-2 mb-6 text-sm text-muted-foreground leading-relaxed">
          We&apos;ve sent a verification link to{" "}
          <b className="text-foreground font-semibold">{email || "your email"}</b>. The link expires in 24 hours.
        </p>

        <div className="flex flex-col gap-2">
          <Button type="button" variant="outline" onClick={() => resend()} disabled={!canResend} isLoading={isPending}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
          </Button>

          {isSuccess && cooldown > 0 && (
            <p className="text-xs text-success text-center">Email sent! Check your inbox.</p>
          )}

          {error && <p className="text-xs text-destructive text-center">{getErrorMessage(error)}</p>}
        </div>
      </div>
    </AuthShell>
  );
}
