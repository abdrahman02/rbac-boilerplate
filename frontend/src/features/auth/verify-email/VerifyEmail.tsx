"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Check, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect } from "react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button, Spinner } from "@/shared/components/ui";
import { apiClient } from "@/shared/lib/api-client";
import { getErrorMessage } from "@/shared/lib/api-error";
import { type AuthenticatedUser, authenticatedUserSchema } from "@/shared/types";

const backLink = (
  <Link href="/login" className="text-primary font-medium no-underline inline-flex items-center gap-1">
    <ChevronLeft size={14} />
    Back to sign in
  </Link>
);

const NoTokenState = memo(function NoTokenState() {
  return (
    <AuthShell footer={backLink}>
      <div className="animate-scale-in mt-3">
        <h1 className="text-2xl font-semibold tracking-tight m-0 inline-flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-destructive/12 text-destructive border border-destructive/22 inline-flex items-center justify-center">
            <AlertCircle size={16} />
          </div>
          Invalid link
        </h1>
        <p className="mt-2 mb-6 text-sm text-muted-foreground leading-relaxed">
          This verification link is missing a token. Please use the link from your email.
        </p>
        <Button variant="outline" asChild>
          <Link href="/login">Go to sign in</Link>
        </Button>
      </div>
    </AuthShell>
  );
});

const LoadingState = memo(function LoadingState() {
  return (
    <AuthShell>
      <div className="flex flex-col items-center gap-4 py-8">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Verifying your email…</p>
      </div>
    </AuthShell>
  );
});

interface ErrorStateProps {
  error: Error;
}

const ErrorState = memo(function ErrorState({ error }: ErrorStateProps) {
  return (
    <AuthShell footer={backLink}>
      <div className="animate-scale-in mt-3">
        <h1 className="text-2xl font-semibold tracking-tight m-0 inline-flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-destructive/12 text-destructive border border-destructive/22 inline-flex items-center justify-center">
            <AlertCircle size={16} />
          </div>
          Verification failed
        </h1>
        <p className="mt-2 mb-6 text-sm text-muted-foreground leading-relaxed">{getErrorMessage(error)}</p>
        <Button variant="outline" asChild>
          <Link href="/login">Go to sign in</Link>
        </Button>
      </div>
    </AuthShell>
  );
});

const SuccessState = memo(function SuccessState() {
  return (
    <AuthShell>
      <div className="animate-scale-in mt-3">
        <h1 className="text-2xl font-semibold tracking-tight m-0 inline-flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-success/12 text-success border border-success/22 inline-flex items-center justify-center">
            <Check size={16} />
          </div>
          Email verified!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Redirecting you to the dashboard…</p>
      </div>
    </AuthShell>
  );
});

export function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const token = searchParams.get("token");

  const { mutate, isPending, isSuccess, isError, error } = useMutation<AuthenticatedUser, Error, string>({
    mutationFn: async (t) => {
      const response = await apiClient.post("/auth/verify-email", { token: t });
      return authenticatedUserSchema.parse(response.data.data);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      router.push("/dashboard");
    },
  });

  useEffect(() => {
    if (token) mutate(token);
  }, [token, mutate]);

  if (!token) return <NoTokenState />;
  if (isPending) return <LoadingState />;
  if (isError && error) return <ErrorState error={error} />;
  if (isSuccess) return <SuccessState />;

  return null;
}
