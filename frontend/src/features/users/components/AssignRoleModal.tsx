"use client";

import { Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { tv } from "tailwind-variants";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { useSyncRoles } from "@/features/users/hooks/useUsers";
import { Alert, Avatar, Badge, Button, Checkbox, Modal } from "@/shared/components/ui";
import { getErrorMessage } from "@/shared/lib/api-error";
import type { RoleWithPermissions, UserWithRoles } from "@/shared/types";

const roleLabel = tv({
  base: "flex items-center gap-3 p-2.5 rounded-lg border-[1.5px] cursor-pointer transition-colors",
  variants: {
    checked: {
      true: "border-primary bg-primary/[.05]",
      false: "border-border bg-background hover:border-border/60",
    },
  },
  defaultVariants: { checked: false },
});

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithRoles;
}

export function AssignRoleModal({ isOpen, onClose, user }: AssignRoleModalProps) {
  const { data: roles = [] } = useRoles();
  const syncRoles = useSyncRoles();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Compute the role IDs the user currently has (derived from role names in user.roles)
  const originalRoleIds = useMemo(
    () => new Set(roles.filter((r) => user.roles.includes(r.name)).map((r) => r.id)),
    [roles, user.roles],
  );

  // Reset selection when modal opens or user changes
  useEffect(() => {
    if (!isOpen) return;
    setSelectedIds(new Set(originalRoleIds));
    setError(null);
  }, [isOpen, user.id]); // intentionally omitting originalRoleIds to avoid mid-session resets

  const toggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const added = [...selectedIds].filter((id) => !originalRoleIds.has(id));
  const removed = [...originalRoleIds].filter((id) => !selectedIds.has(id));
  const isDirty = added.length > 0 || removed.length > 0;
  const isPending = syncRoles.isPending;

  const handleSave = async () => {
    setError(null);
    try {
      await syncRoles.mutateAsync({ userId: user.id, roleIds: [...selectedIds] });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleClose = () => {
    setSelectedIds(new Set(originalRoleIds));
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Manage roles — ${user.name}`} maxWidth="md">
      <div className="flex flex-col gap-3.5 pt-1">
        <p className="text-sm text-muted-foreground">
          Users can hold any number of roles. Check the ones to grant; uncheck to revoke.
        </p>

        {error && <Alert message={error} />}

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
          <Button type="button" disabled={!isDirty} isLoading={isPending} onClick={handleSave}>
            {isDirty ? `Save ${selectedIds.size} role${selectedIds.size === 1 ? "" : "s"}` : "No changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface RoleCheckboxProps {
  role: RoleWithPermissions;
  checked: boolean;
  adding: boolean;
  removing: boolean;
  onToggle: () => void;
}

function RoleCheckbox({ role, checked, adding, removing, onToggle }: RoleCheckboxProps) {
  return (
    <label className={roleLabel({ checked })}>
      <Checkbox checked={checked} onChange={onToggle} />
      <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
        <Shield size={14} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold">{role.name}</div>
        <div className="text-[12px] text-muted-foreground">
          {role.permissions.length} permission{role.permissions.length === 1 ? "" : "s"}
        </div>
      </div>
      {adding && <Badge variant="success">Adding</Badge>}
      {removing && <Badge variant="danger">Removing</Badge>}
    </label>
  );
}
