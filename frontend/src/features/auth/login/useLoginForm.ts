"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { BaseSyntheticEvent } from "react";
import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { apiClient } from "@/shared/lib/api-client";
import { getErrorMessage } from "@/shared/lib/api-error";
import { type AuthenticatedUser, authenticatedUserSchema } from "@/shared/types";
import { type LoginInput, loginSchema } from "./LoginForm.schema";

interface UseLoginFormReturn {
  form: UseFormReturn<LoginInput>;
  isPending: boolean;
  isUnverified: boolean;
  submittedEmail: string;
  showPassword: boolean;
  toggleShowPassword: () => void;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export function useLoginForm(): UseLoginFormReturn {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [isUnverified, setIsUnverified] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { setError } = form;

  const { mutate, isPending } = useMutation<AuthenticatedUser, Error, LoginInput>({
    mutationFn: async (data) => {
      const response = await apiClient.post("/auth/login", data);
      return authenticatedUserSchema.parse(response.data.data);
    },
    onSuccess: (user) => {
      setIsUnverified(false);
      queryClient.setQueryData(["auth", "me"], user);
      router.push("/dashboard");
    },
    onError: (err) => {
      const message = getErrorMessage(err);
      // Detect EMAIL_NOT_VERIFIED (403 + "verify" in message) to show resend link
      const unverified =
        axios.isAxiosError(err) &&
        err.response?.status === 403 &&
        message.toLowerCase().includes("verify");
      setIsUnverified(unverified);
      setError("root", { message });
    },
  });

  // toggleShowPassword is passed to child components, so it needs useCallback
  const toggleShowPassword = useCallback(() => setShowPassword((s) => !s), []);

  const onSubmit = form.handleSubmit((data) => {
    setSubmittedEmail(data.email);
    mutate(data);
  });

  return { form, isPending, isUnverified, submittedEmail, showPassword, toggleShowPassword, onSubmit };
}
