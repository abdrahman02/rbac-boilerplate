"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { BaseSyntheticEvent } from "react";
import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { type ResetPasswordInput, resetPasswordSchema } from "./resetPassword.schema";

interface UseResetPasswordFormReturn {
  form: UseFormReturn<ResetPasswordInput>;
  isLoading: boolean;
  done: boolean;
  password: string;
  onContinue: () => void;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export function useResetPasswordForm(): UseResetPasswordFormReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // useWatch feeds the PasswordStrengthMeter without triggering re-renders on the form
  const password = useWatch({ control: form.control, name: "password" }) ?? "";

  // onContinue navigates to login — defined in hook so the component stays pure JSX
  const onContinue = useCallback(() => router.push("/login"), [router]);

  const onSubmit = form.handleSubmit(async () => {
    setIsLoading(true);
    try {
      // Replace with useMutation when POST /auth/reset-password backend is ready
      setDone(true);
    } finally {
      setIsLoading(false);
    }
  });

  return { form, isLoading, done, password, onContinue, onSubmit };
}
