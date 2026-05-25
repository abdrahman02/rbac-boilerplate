"use client";

import { useState } from "react";
import { Button, Badge } from "@/shared/components/ui";
import { PermissionGate } from "@/shared/components/guard/PermissionGate";
import { useRoles, useDeleteRole } from "@/features/roles/hooks/useRoles";
import { RoleModal } from "@/features/roles/components/RoleModal";
import { AssignPermissionModal } from "@/features/roles/components/AssignPermissionModal";
import { getErrorMessage } from "@/shared/lib/api-error";
import type { RoleWithPermissions } from "@/shared/types";

export default function RolesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: roles = [], isLoading } = useRoles();
  const deleteRole = useDeleteRole();

  const openCreate = () => {
    setSelectedRole(null);
    setModalOpen(true);
  };

  const openEdit = (role: RoleWithPermissions) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const openPermissions = (role: RoleWithPermissions) => {
    setSelectedRole(role);
    setPermModalOpen(true);
  };

  const handleDelete = async (role: RoleWithPermissions) => {
    if (!confirm(`Delete role "${role.name}"?`)) return;
    setDeleteError(null);
    try {
      await deleteRole.mutateAsync(role.id);
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
          <p className="mt-1 text-sm text-gray-500">{roles.length} total roles</p>
        </div>
        <PermissionGate permission="roles:create">
          <Button onClick={openCreate}>+ Create Role</Button>
        </PermissionGate>
      </div>

      {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Description", "Permissions", "Created", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{role.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{role.description ?? "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((p) => (
                        <Badge key={p}>{p}</Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="warning">+{role.permissions.length - 3} more</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(role.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <PermissionGate permission="roles:update">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(role)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openPermissions(role)}>
                          Permissions
                        </Button>
                      </PermissionGate>
                      <PermissionGate permission="roles:delete">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(role)}
                          isLoading={deleteRole.isPending}
                        >
                          Delete
                        </Button>
                      </PermissionGate>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RoleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} role={selectedRole} />

      {selectedRole && (
        <AssignPermissionModal isOpen={permModalOpen} onClose={() => setPermModalOpen(false)} role={selectedRole} />
      )}
    </div>
  );
}
