"use client";

import { Check, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button } from "@/shared/components/ui";

const backLink = (
  <Link href="/login" className="text-primary font-medium no-underline inline-flex items-center gap-1">
    <ChevronLeft size={14} />
    Back to sign in
  </Link>
);

export function VerifyEmailSent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "your email";

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
          <b className="text-foreground font-semibold">{email}</b>. The link expires in 24 hours.
        </p>

        <p className="text-sm text-muted-foreground mb-4">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <Link href="/login" className="text-primary font-medium no-underline">
            sign in
          </Link>{" "}
          to request a new one.
        </p>
      </div>
    </AuthShell>
  );
}
