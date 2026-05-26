"use client";

import { Alert, Avatar, Button, Modal } from "@/shared/components/ui";
import type { UserWithRoles } from "@/shared/types";
import { RoleCheckbox } from "../RoleCheckbox";
import { useAssignRoleModal } from "./useAssignRoleModal";

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithRoles;
}

export function AssignRoleModal({ isOpen, onClose, user }: AssignRoleModalProps) {
  const {
    handleSubmit,
    onSubmit,
    handleClose,
    errors,
    selectedIds,
    roles,
    originalRoleIds,
    toggle,
    isDirty,
    added,
    removed,
    isSubmitting,
  } = useAssignRoleModal({ isOpen, onClose, user });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Manage roles — ${user.name}`} maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 pt-1">
        <p className="text-sm text-muted-foreground">
          Users can hold any number of roles. Check the ones to grant; uncheck to revoke.
        </p>

        {errors.root && <Alert message={errors.root.message ?? "An error occurred"} />}

        {/* User card */}
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border">
          <Avatar name={user.name} size={36} />
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold">{user.name}</div>
            <div className="text-[12.5px] text-muted-foreground">{user.email}</div>
          </div>
          <span className="text-[12px] text-muted-foreground shrink-0">
            {selectedIds.size} of {roles.length} selected
          </span>
        </div>

        {/* Role checklist */}
        <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1">
          {roles.map((role) => {
            const isChecked = selectedIds.has(role.id);
            const wasChecked = originalRoleIds.has(role.id);
            return (
              <RoleCheckbox
                key={role.id}
                role={role}
                checked={isChecked}
                adding={isChecked && !wasChecked}
                removing={!isChecked && wasChecked}
                onToggle={() => toggle(role.id)}
              />
            );
          })}
        </div>

        {/* Diff summary */}
        {isDirty && (
          <div className="text-[12.5px] text-muted-foreground px-2.5 py-2 bg-muted rounded-md">
            {added.length > 0 && (
              <span>
                Adding <b className="text-success">{added.length}</b>
                {removed.length > 0 ? " · " : ""}
              </span>
            )}
            {removed.length > 0 && (
              <span>
                Removing <b className="text-destructive">{removed.length}</b>
              </span>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty} isLoading={isSubmitting}>
            {isDirty ? `Save ${selectedIds.size} role${selectedIds.size === 1 ? "" : "s"}` : "No changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
