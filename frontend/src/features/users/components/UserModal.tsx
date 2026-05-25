"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateUser, useUpdateUser } from "@/features/users/hooks/useUsers";
import { Alert, Button, FormField, Input, Modal } from "@/shared/components/ui";
import { getErrorMessage } from "@/shared/lib/api-error";
import type { UserWithRoles } from "@/shared/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email({ message: "Invalid email" }),
  // Optional at schema level (edit mode sends ""); refines only run when value is non-empty
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, "At least 8 characters")
    .refine(
      (val) => !val || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
      "Must contain uppercase, lowercase, and a number",
    ),
});

type FormInput = z.infer<typeof schema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserWithRoles | null;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const isEditing = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset(isEditing ? { name: user.name, email: user.email, password: "" } : {});
    }
  }, [isOpen, isEditing, user, reset]);

  const onSubmit = async (data: FormInput) => {
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
