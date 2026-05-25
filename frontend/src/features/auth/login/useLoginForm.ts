"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { loginSchema, type LoginInput } from "./login.schema";
import { loginApi } from "./login.api";

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
