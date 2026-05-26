import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/shared/lib/api-error";
import type { UserWithRoles } from "@/shared/types";
import { useCreateUser, useUpdateUser } from "../../hooks";
import { type UserModalInput, type UserModalOutput, userModalSchema } from "./UserModal.schema";

interface Params {
  isOpen: boolean;
  onClose: () => void;
  user?: UserWithRoles | null;
}

export const useUserModal = ({ isOpen, onClose, user }: Params) => {
  const isEditing = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserModalInput, unknown, UserModalOutput>({ resolver: zodResolver(userModalSchema) });

  useEffect(() => {
    if (isOpen) {
      reset(isEditing ? { name: user.name, email: user.email, password: "" } : {});
    }
  }, [isOpen, isEditing, user, reset]);

  const onSubmit = async (data: UserModalInput) => {
    if (!isEditing && !data.password) {
      setError("password", { message: "Password is required" });
      return;
    }
    try {
      if (isEditing) {
        await updateUser.mutateAsync({ id: user.id, payload: { name: data.name, email: data.email } });
      } else {
        await createUser.mutateAsync({ name: data.name, email: data.email, password: data.password! });
      }
      onClose();
    } catch (err) {
      setError("root", { message: getErrorMessage(err) });
    }
  };

  return {
    isEditing,
    handleSubmit,
    onSubmit,
    errors,
    register,
    isSubmitting,
  };
};
