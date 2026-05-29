import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import type { RoleWithPermissions } from "@/shared/types";
import { useCreateRole, useUpdateRole } from "../../hooks/useRoles";
import { type RoleModalInput, roleModalSchema } from "./RoleModal.schema";

interface Params {
  isOpen: boolean;
  onClose: () => void;
  role?: RoleWithPermissions | null;
}

export function useRoleModal({ isOpen, onClose, role }: Params) {
  const isEditing = !!role;
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<RoleModalInput>({ resolver: zodResolver(roleModalSchema) });

  useEffect(() => {
    if (isOpen) {
      reset(isEditing ? { name: role.name, description: role.description ?? "" } : {});
    }
  }, [isOpen, isEditing, role, reset]);

  const onSubmit = (data: RoleModalInput) => {
    if (isEditing) {
      updateRole.mutate(
        { id: role.id, payload: { name: data.name, description: data.description } },
        {
          onSuccess: () => {
            toast.success("Role updated", { description: data.name });
            onClose();
            reset();
          },
          onError: (err) => setError("root", { message: getErrorMessage(err) }),
        },
      );
    } else {
      createRole.mutate(
        { name: data.name, description: data.description },
        {
          onSuccess: () => {
            toast.success("Role created", { description: data.name });
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
    isSubmitting: isEditing ? updateRole.isPending : createRole.isPending,
  };
}
