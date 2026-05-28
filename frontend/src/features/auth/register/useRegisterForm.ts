"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { getErrorMessage } from "@/shared/lib/api-error";
import { registerApi } from "./RegisterForm.api";
import { type RegisterInput, registerSchema } from "./RegisterForm.schema";

interface UseRegisterFormReturn {
  form: UseFormReturn<RegisterInput>;
  isPending: boolean;
  /** Live password value — used by PasswordStrengthMeter without extra state. */
  password: string;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
}

export function useRegisterForm(): UseRegisterFormReturn {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });
  const { setError } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: registerApi,
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      router.push("/dashboard");
    },
    onError: (err) => setError("root", { message: getErrorMessage(err) }),
  });

  // useWatch is preferred over watch() — it subscribes only this field to re-renders.
  const password = useWatch({ control: form.control, name: "password" }) ?? "";

  // Destructure confirmPassword out so it is never sent to the API.
  const onSubmit = form.handleSubmit(({ name, email, password: pw }) => mutate({ name, email, password: pw }));

  return { form, isPending, password, onSubmit };
}
