"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { BaseSyntheticEvent } from "react";
import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
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
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // onRetry is passed as a prop to SuccessState, useCallback ensures referential stability
  const onRetry = useCallback(() => setSuccess(false), []);

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      // TODO: Replace with useMutation when POST /auth/forgot-password backend is ready
      setSubmittedEmail(data.email);
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
  });

  return { form, isLoading, success, submittedEmail, onRetry, onSubmit };
}
