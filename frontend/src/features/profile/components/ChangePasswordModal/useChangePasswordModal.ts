import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiClient } from "@/shared/lib/api-client";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import { type ChangePasswordInput, changePasswordSchema } from "./ChangePasswordModal.schema";

interface Params {
  isOpen: boolean;
  onClose: () => void;
}

export function useChangePasswordModal({ isOpen, onClose }: Params) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      await apiClient.post("/auth/change-password", {
        current_password: data.current_password,
        new_password: data.new_password,
      });
    },
    onSuccess: () => {
      toast.success("Password changed");
      onClose();
    },
    onError: (err) => setError("root", { message: getErrorMessage(err) }),
  });

  const onSubmit = (data: ChangePasswordInput) => mutation.mutate(data);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting: mutation.isPending,
  };
}
