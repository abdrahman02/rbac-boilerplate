"use client";

import { Key } from "lucide-react";
import { Alert, Button, FormField, Input, Modal } from "@/shared/components/ui";
import type { Permission } from "@/shared/types";
import { usePermissionModal } from "./usePermissionModal";

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission?: Permission | null;
}

export function PermissionModal({ isOpen, onClose, permission }: PermissionModalProps) {
  const { isEditing, handleSubmit, onSubmit, errors, register, isSubmitting } = usePermissionModal({
    isOpen,
    onClose,
    permission,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit permission" : "Create permission"}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-1">
        <p className="text-sm text-muted-foreground">
          {isEditing
            ? "Update the permission name or description."
            : "Use the format resource:action (e.g. users:read)."}
        </p>

        {errors.root?.message && <Alert message={errors.root.message} />}

        <FormField
          label="Name (resource:action)"
          htmlFor="permission-name"
          hint={!errors.name?.message ? "Format: resource:action — e.g. users:read" : undefined}
          error={errors.name?.message}
          required
        >
          <Input
            id="permission-name"
            {...register("name")}
            placeholder="users:read"
            iconLeft={<Key size={15} />}
            className="font-mono"
            error={!!errors.name?.message}
          />
        </FormField>

        <FormField label="Description" htmlFor="permission-description" error={errors.description?.message}>
          <Input
            id="permission-description"
            {...register("description")}
            placeholder="Optional — describe what this permission grants"
            error={!!errors.description?.message}
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Save changes" : "Create permission"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
