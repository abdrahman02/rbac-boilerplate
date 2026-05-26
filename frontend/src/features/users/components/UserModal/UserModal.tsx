"use client";

import { Lock, Mail, User } from "lucide-react";
import { Alert, Button, FormField, Input, Modal } from "@/shared/components/ui";
import type { UserWithRoles } from "@/shared/types";
import { useUserModal } from "./useUserModal";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserWithRoles | null;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const { isEditing, handleSubmit, onSubmit, errors, register, isSubmitting } = useUserModal({ isOpen, onClose, user });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit user" : "Add user"}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 pt-1">
        <p className="text-sm text-muted-foreground -mt-0.5">
          {isEditing
            ? "Update this user's basic information."
            : "Set a temporary password the user can change after signing in."}
        </p>

        {errors.root && <Alert message={errors.root.message ?? "An error occurred"} />}

        <FormField label="Full name" htmlFor="user-name" required error={errors.name?.message}>
          <Input
            id="user-name"
            {...register("name")}
            placeholder="Ada Lovelace"
            iconLeft={<User size={15} />}
            error={errors.name?.message}
          />
        </FormField>

        <FormField label="Email" htmlFor="user-email" required error={errors.email?.message}>
          <Input
            id="user-email"
            type="email"
            {...register("email")}
            placeholder="ada@company.com"
            iconLeft={<Mail size={15} />}
            error={errors.email?.message}
          />
        </FormField>

        {!isEditing && (
          <FormField
            label="Temporary password"
            htmlFor="user-password"
            required
            error={errors.password?.message}
            hint={!errors.password?.message ? "Lowercase, uppercase, and at least one number required." : undefined}
          >
            <Input
              id="user-password"
              type="password"
              {...register("password")}
              placeholder="Uppercase, number, min 8 chars"
              iconLeft={<Lock size={15} />}
              error={errors.password?.message}
            />
          </FormField>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Save changes" : "Add user"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
