"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { BaseSyntheticEvent } from "react";
import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { loginApi } from "./LoginForm.api";
import { type LoginInput, loginSchema } from "./LoginForm.schema";

interface UseLoginFormReturn {
  form: UseFormReturn<LoginInput>;
  isPending: boolean;
  error: Error | null;
  showPassword: boolean;
  toggleShowPassword: () => void;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export function useLoginForm(): UseLoginFormReturn {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginApi,
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      router.push("/dashboard");
    },
  });

  // toggleShowPassword is passed to child components, so it needs useCallback
  const toggleShowPassword = useCallback(() => setShowPassword((s) => !s), []);

  // form.handleSubmit is already stable from RHF, no useCallback wrapper needed
  const onSubmit = form.handleSubmit((data) => mutate(data));

  return { form, isPending, error, showPassword, toggleShowPassword, onSubmit };
}
