"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { BaseSyntheticEvent } from "react";
import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { apiClient } from "@/shared/lib/api-client";
import { getErrorMessage } from "@/shared/lib/api-error";
import { type ForgotPasswordInput, forgotPasswordSchema } from "./ForgotPasswordForm.schema";

interface UseForgotPasswordFormReturn {
  form: UseFormReturn<ForgotPasswordInput>;
  isLoading: boolean;
  success: boolean;
  submittedEmail: string;
  onRetry: () => void;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export function useForgotPasswordForm(): UseForgotPasswordFormReturn {
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { setError } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      await apiClient.post("/auth/forgot-password", data);
    },
    onSuccess: (_, data) => {
      setSubmittedEmail(data.email);
      setSuccess(true);
    },
    onError: (err) => setError("root", { message: getErrorMessage(err) }),
  });

  // onRetry is passed as a prop to SuccessState — useCallback ensures referential stability
  const onRetry = useCallback(() => setSuccess(false), []);

  const onSubmit = form.handleSubmit((data) => mutate(data));

  return { form, isLoading: isPending, success, submittedEmail, onRetry, onSubmit };
}
