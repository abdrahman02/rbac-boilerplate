"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import type { BaseSyntheticEvent } from "react";
import { useCallback, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { apiClient } from "@/shared/lib/api-client";
import { getErrorMessage } from "@/shared/lib/api-error";
import { type ResetPasswordInput, resetPasswordSchema } from "./ResetPasswordForm.schema";

interface UseResetPasswordFormReturn {
  form: UseFormReturn<ResetPasswordInput>;
  isLoading: boolean;
  done: boolean;
  hasToken: boolean;
  password: string;
  onContinue: () => void;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export function useResetPasswordForm(): UseResetPasswordFormReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { setError } = form;

  // Redirect to /forgot-password if no token in URL
  useEffect(() => {
    if (token === null) router.replace("/forgot-password");
  }, [token, router]);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      await apiClient.post("/auth/reset-password", { token, password: data.password });
    },
    onError: (err) => setError("root", { message: getErrorMessage(err) }),
  });

  // useWatch feeds the PasswordStrengthMeter without triggering re-renders on the form
  const password = useWatch({ control: form.control, name: "password" }) ?? "";

  // onContinue navigates to login — defined in hook so the component stays pure JSX
  const onContinue = useCallback(() => router.push("/login"), [router]);

  const onSubmit = form.handleSubmit((data) => mutate(data));

  return {
    form,
    isLoading: isPending,
    done: isSuccess,
    hasToken: token !== null,
    password,
    onContinue,
    onSubmit,
  };
}
