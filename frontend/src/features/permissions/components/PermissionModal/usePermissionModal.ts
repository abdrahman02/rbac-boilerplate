import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import type { Permission } from "@/shared/types";
import { useCreatePermission, useUpdatePermission } from "../../hooks/usePermissions";
import { type PermissionModalInput, permissionModalSchema } from "./PermissionModal.schema";

interface Params {
  isOpen: boolean;
  onClose: () => void;
  permission?: Permission | null;
}

export function usePermissionModal({ isOpen, onClose, permission }: Params) {
  const isEditing = !!permission;
  const createPermission = useCreatePermission();
  const updatePermission = useUpdatePermission();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PermissionModalInput>({ resolver: zodResolver(permissionModalSchema) });

  useEffect(() => {
    if (isOpen) {
      reset(isEditing ? { name: permission.name, description: permission.description ?? "" } : {});
    }
  }, [isOpen, isEditing, permission, reset]);

  const onSubmit = (data: PermissionModalInput) => {
    if (isEditing) {
      updatePermission.mutate(
        { id: permission.id, payload: { name: data.name, description: data.description } },
        {
          onSuccess: () => {
            toast.success("Permission updated", { description: data.name });
            onClose();
            reset();
          },
          onError: (err) => setError("root", { message: getErrorMessage(err) }),
        },
      );
    } else {
      createPermission.mutate(
        { name: data.name, description: data.description },
        {
          onSuccess: () => {
            toast.success("Permission created", { description: data.name });
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
    isSubmitting: isEditing ? updatePermission.isPending : createPermission.isPending,
  };
}
