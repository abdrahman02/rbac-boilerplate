"use client";

import { Mail, User } from "lucide-react";
import { Alert, Button, FormField, Input, Modal } from "@/shared/components/ui";
import { useEditProfileModal } from "./useEditProfileModal";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } = useEditProfileModal({
    isOpen,
    onClose,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit profile">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 pt-1">
        <p className="text-sm text-muted-foreground -mt-0.5">Update your name and email address.</p>

        {errors.root && <Alert message={errors.root.message ?? "An error occurred"} />}

        <FormField label="Full name" htmlFor="profile-name" required error={errors.name?.message}>
          <Input
            id="profile-name"
            {...register("name")}
            placeholder="Ada Lovelace"
            iconLeft={<User size={15} />}
            error={errors.name?.message}
          />
        </FormField>

        <FormField label="Email" htmlFor="profile-email" required error={errors.email?.message}>
          <Input
            id="profile-email"
            type="email"
            {...register("email")}
            placeholder="ada@company.com"
            iconLeft={<Mail size={15} />}
            error={errors.email?.message}
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
