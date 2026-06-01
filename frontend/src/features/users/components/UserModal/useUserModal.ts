import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
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
    formState: { errors },
  } = useForm<UserModalInput, unknown, UserModalOutput>({ resolver: zodResolver(userModalSchema) });

  useEffect(() => {
    if (isOpen) {
      reset(isEditing ? { name: user.name, email: user.email } : {});
    }
  }, [isOpen, isEditing, user, reset]);

  const onSubmit = (data: UserModalInput) => {
    if (isEditing) {
      updateUser.mutate(
        { id: user.id, payload: { name: data.name, email: data.email } },
        {
          onSuccess: () => {
            toast.success("User updated", { description: data.name });
            onClose();
            reset();
          },
          onError: (err) => setError("root", { message: getErrorMessage(err) }),
        },
      );
    } else {
      createUser.mutate(
        { name: data.name, email: data.email },
        {
          onSuccess: () => {
            toast.success("Invite sent", { description: `Invitation email sent to ${data.email}` });
            onClose();
            reset();
          },
          onError: (err) => setError("root", { message: getErrorMessage(err) }),
        },
      );
    }
  };

  return {
    isEditing,
    handleSubmit,
    onSubmit,
    errors,
    register,
    isSubmitting: isEditing ? updateUser.isPending : createUser.isPending,
  };
};
