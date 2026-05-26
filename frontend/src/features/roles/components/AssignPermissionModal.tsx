"use client";

import { useState } from "react";
import { tv } from "tailwind-variants";
import { usePermissionList } from "@/features/permissions/hooks/usePermissionsCrud";
import { useAssignPermissionToRole, useRemovePermissionFromRole } from "@/features/roles/hooks/useRoles";
import { Alert, Button, Checkbox, Modal } from "@/shared/components/ui";
import { getErrorMessage } from "@/shared/lib/api-error";
import type { RoleWithPermissions } from "@/shared/types";

const permRow = tv({
  base: "flex items-center gap-3 p-2.5 rounded-lg border-[1.5px] cursor-pointer transition-colors",
  variants: {
    checked: {
      true: "border-primary bg-primary/[.05]",
      false: "border-border bg-background hover:border-border/60",
    },
  },
  defaultVariants: { checked: false },
});

interface AssignPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleWithPermissions;
}

export function AssignPermissionModal({ isOpen, onClose, role }: AssignPermissionModalProps) {
  const { data: permissions = [] } = usePermissionList();
  const assignPerm = useAssignPermissionToRole();
  const removePerm = useRemovePermissionFromRole();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (permissionId: number, hasPerm: boolean) => {
    setError(null);
    try {
      if (hasPerm) {
        await removePerm.mutateAsync({ roleId: role.id, permissionId });
      } else {
        await assignPerm.mutateAsync({ roleId: role.id, permissionId });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const isPending = assignPerm.isPending || removePerm.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Permissions — ${role.name}`} maxWidth="lg">
      <div className="max-h-96 space-y-2 overflow-y-auto">
        {permissions.map((perm) => {
          const hasPerm = role.permissions.includes(perm.name);
          return (
            <label key={perm.id} className={permRow({ checked: hasPerm })}>
              <Checkbox
                checked={hasPerm}
                onCheckedChange={(checked) => handleToggle(perm.id, !checked)}
                disabled={isPending}
              />
              <div>
                <p className="font-mono text-sm font-medium">{perm.name}</p>
                {perm.description && (
                  <p className="text-xs text-muted-foreground">{perm.description}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {error && <Alert message={error} className="mt-2" />}

      <div className="flex justify-end pt-4">
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
