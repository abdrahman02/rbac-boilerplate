"use client";

import { useState } from "react";
import { Modal, Button } from "@/shared/components/ui";
import { usePermissionList } from "@/features/permissions/hooks/usePermissionsCrud";
import { useAssignPermissionToRole, useRemovePermissionFromRole } from "@/features/roles/hooks/useRoles";
import { getErrorMessage } from "@/shared/lib/api-error";
import type { RoleWithPermissions } from "@/shared/types";

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
            <div key={perm.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-mono text-sm font-medium text-gray-900">{perm.name}</p>
                {perm.description && <p className="text-xs text-gray-500">{perm.description}</p>}
              </div>
              <Button
                size="sm"
                variant={hasPerm ? "danger" : "primary"}
                onClick={() => handleToggle(perm.id, hasPerm)}
                isLoading={isPending}
              >
                {hasPerm ? "Remove" : "Assign"}
              </Button>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
