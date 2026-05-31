import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/shared/hooks";
import { apiClient } from "@/shared/lib/api-client";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import { type EditProfileInput, editProfileSchema } from "./EditProfileModal.schema";

interface Params {
  isOpen: boolean;
  onClose: () => void;
}

export function useEditProfileModal({ isOpen, onClose }: Params) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EditProfileInput>({ resolver: zodResolver(editProfileSchema) });

  useEffect(() => {
    if (isOpen && user) {
      reset({ name: user.name, email: user.email });
    }
  }, [isOpen, user, reset]);

  const mutation = useMutation({
    mutationFn: async (data: EditProfileInput) => {
      const res = await apiClient.patch("/auth/me", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Profile updated");
      onClose();
    },
    onError: (err) => setError("root", { message: getErrorMessage(err) }),
  });

  const onSubmit = (data: EditProfileInput) => mutation.mutate(data);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting: mutation.isPending,
  };
}
