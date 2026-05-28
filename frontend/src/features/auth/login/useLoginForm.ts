"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const { setError } = form;

  const { mutate, isPending } = useMutation<AuthenticatedUser, Error, LoginInput>({
    mutationFn: async (data) => {
      const response = await apiClient.post("/auth/login", data);
      return authenticatedUserSchema.parse(response.data.data);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      router.push("/dashboard");
    },
    onError: (err) => setError("root", { message: getErrorMessage(err) }),
  });

  // toggleShowPassword is passed to child components, so it needs useCallback
  const toggleShowPassword = useCallback(() => setShowPassword((s) => !s), []);

  // form.handleSubmit is already stable from RHF, no useCallback wrapper needed
  const onSubmit = form.handleSubmit((data) => mutate(data));

  return { form, isPending, showPassword, toggleShowPassword, onSubmit };
}
