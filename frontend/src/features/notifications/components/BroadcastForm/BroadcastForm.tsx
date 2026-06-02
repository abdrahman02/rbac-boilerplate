"use client";

import { Send } from "lucide-react";
import { Alert, Button, Checkbox, FormField, Input } from "@/shared/components/ui";
import type { RoleWithPermissions } from "@/shared/types";
import { roleLabel } from "./BroadcastForm.variants";
import { useBroadcastForm } from "./useBroadcastForm";

interface BroadcastFormProps {
  roles: RoleWithPermissions[];
}

export function BroadcastForm({ roles }: BroadcastFormProps) {
  const { register, handleSubmit, onSubmit, errors, selectedRoleIds, toggleRole, isSubmitting } = useBroadcastForm({
    roles,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {errors.root && <Alert message={errors.root.message ?? "Terjadi kesalahan"} />}

      <FormField label="Judul" htmlFor="broadcast-title" required error={errors.title?.message}>
        <Input
          id="broadcast-title"
          {...register("title")}
          placeholder="Masukkan judul notifikasi"
          error={errors.title?.message}
        />
      </FormField>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="broadcast-message" className="text-sm font-medium text-foreground">
          Pesan <span className="text-destructive">*</span>
        </label>
        <textarea
          id="broadcast-message"
          {...register("message")}
          rows={4}
          placeholder="Tulis pesan broadcast..."
          aria-describedby={errors.message ? "broadcast-message-error" : undefined}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
        {errors.message && (
          <p id="broadcast-message-error" className="text-xs text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">
          Target Role <span className="text-destructive">*</span>
        </span>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((role) => {
            const checked = selectedRoleIds.includes(role.id);
            const checkboxId = `broadcast-role-${role.id}`;
            return (
              <label key={role.id} htmlFor={checkboxId} className={roleLabel({ checked })}>
                <Checkbox
                  id={checkboxId}
                  checked={checked}
                  onCheckedChange={() => toggleRole(role.id)}
                  className="shrink-0"
                />
                <span className="text-sm font-medium capitalize">{role.name}</span>
              </label>
            );
          })}
        </div>
        {errors.role_ids && <p className="text-xs text-destructive">{errors.role_ids.message}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          <Send size={14} className="mr-1.5" />
          Kirim Broadcast
        </Button>
      </div>
    </form>
  );
}
