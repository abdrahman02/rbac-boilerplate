"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { registerApi } from "./RegisterForm.api";
import { type RegisterInput, registerSchema } from "./RegisterForm.schema";

interface UseRegisterFormReturn {
  form: UseFormReturn<RegisterInput>;
  isPending: boolean;
  error: Error | null;
  /** Live password value — used by PasswordStrengthMeter without extra state. */
  password: string;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

/**
 * Encapsulates all side-effecting logic for the register flow:
 * form state, mutation, routing, and query cache update.
 * The component layer stays pure JSX with no async or routing code.
 */
export function useRegisterForm(): UseRegisterFormReturn {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: registerApi,
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      router.push("/dashboard");
    },
  });

  const form = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  // useWatch is preferred over watch() — it subscribes only this field to re-renders.
  const password = useWatch({ control: form.control, name: "password" }) ?? "";

  // Destructure confirmPassword out so it is never sent to the API.
  const onSubmit = form.handleSubmit(({ name, email, password: pw }) => mutate({ name, email, password: pw }));

  return { form, isPending, error, password, onSubmit };
}
