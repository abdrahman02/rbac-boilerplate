"use client";

import { Shield } from "lucide-react";
import { Alert, Button, FormField, Input, Modal } from "@/shared/components/ui";
import type { RoleWithPermissions } from "@/shared/types";
import { useRoleModal } from "./useRoleModal";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: RoleWithPermissions | null;
}

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
  const { isEditing, handleSubmit, onSubmit, errors, register, isSubmitting } = useRoleModal({
    isOpen,
    onClose,
    role,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit role" : "Create role"}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-1">
        <p className="text-sm text-muted-foreground">
          {isEditing
            ? "Rename the role; permission assignments stay intact."
            : "Permissions can be attached after the role is created."}
        </p>

        {errors.root?.message && <Alert message={errors.root.message} />}

        <FormField
          label="Role name"
          htmlFor="role-name"
          hint={!errors.name?.message ? "Short, descriptive names work best — e.g. 'Billing Manager'." : undefined}
          error={errors.name?.message}
          required
        >
          <Input
            id="role-name"
            {...register("name")}
            placeholder="e.g. Editor"
            iconLeft={<Shield size={15} />}
            error={!!errors.name?.message}
          />
        </FormField>

        <FormField label="Description" htmlFor="role-description" error={errors.description?.message}>
          <Input
            id="role-description"
            {...register("description")}
            placeholder="Optional — describe what this role grants"
            error={!!errors.description?.message}
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Save changes" : "Create role"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
