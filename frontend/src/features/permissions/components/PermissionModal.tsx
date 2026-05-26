"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreatePermission, useUpdatePermission } from "@/features/permissions/hooks/usePermissionsCrud";
import { Alert, Button, FormField, Input, Modal } from "@/shared/components/ui";
import { getErrorMessage } from "@/shared/lib/api-error";
import type { Permission } from "@/shared/types";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-z_]+:[a-z_]+$/, "Format must be resource:action (e.g. users:read)"),
  description: z.string().optional(),
});

type FormInput = z.infer<typeof schema>;

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission?: Permission | null;
}

export function PermissionModal({ isOpen, onClose, permission }: PermissionModalProps) {
  const isEditing = !!permission;
  const createPermission = useCreatePermission();
  const updatePermission = useUpdatePermission();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset(isEditing ? { name: permission.name, description: permission.description ?? "" } : {});
    }
  }, [isOpen, isEditing, permission, reset]);

  const onSubmit = async (data: FormInput) => {
    try {
      if (isEditing) {
        await updatePermission.mutateAsync({ id: permission.id, payload: data });
      } else {
        await createPermission.mutateAsync(data);
      }
      onClose();
    } catch (err) {
      setError("root", { message: getErrorMessage(err) });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Permission" : "Create Permission"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root?.message && <Alert message={errors.root.message} />}

        <FormField label="Name (resource:action)" error={errors.name?.message}>
          <Input {...register("name")} placeholder="users:read" className="font-mono" error={errors.name?.message} />
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          <Input {...register("description")} placeholder="Can read users" error={errors.description?.message} />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Save Changes" : "Create Permission"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
