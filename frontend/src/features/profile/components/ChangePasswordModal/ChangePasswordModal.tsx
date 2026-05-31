"use client";

import { Lock } from "lucide-react";
import { Alert, Button, FormField, Input, Modal } from "@/shared/components/ui";
import { useChangePasswordModal } from "./useChangePasswordModal";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } = useChangePasswordModal({
    isOpen,
    onClose,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 pt-1">
        <p className="text-sm text-muted-foreground -mt-0.5">
          Enter your current password and choose a new one.
        </p>

        {errors.root && <Alert message={errors.root.message ?? "An error occurred"} />}

        <FormField
          label="Current password"
          htmlFor="current-password"
          required
          error={errors.current_password?.message}
        >
          <Input
            id="current-password"
            type="password"
            {...register("current_password")}
            placeholder="Your current password"
            iconLeft={<Lock size={15} />}
            error={errors.current_password?.message}
          />
        </FormField>

        <FormField
          label="New password"
          htmlFor="new-password"
          required
          error={errors.new_password?.message}
          hint={!errors.new_password?.message ? "Uppercase, lowercase, and at least one number required." : undefined}
        >
          <Input
            id="new-password"
            type="password"
            {...register("new_password")}
            placeholder="Min 8 chars, uppercase & number"
            iconLeft={<Lock size={15} />}
            error={errors.new_password?.message}
          />
        </FormField>

        <FormField
          label="Confirm password"
          htmlFor="confirm-password"
          required
          error={errors.confirm_password?.message}
        >
          <Input
            id="confirm-password"
            type="password"
            {...register("confirm_password")}
            placeholder="Repeat your new password"
            iconLeft={<Lock size={15} />}
            error={errors.confirm_password?.message}
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Change password
          </Button>
        </div>
      </form>
    </Modal>
  );
}
