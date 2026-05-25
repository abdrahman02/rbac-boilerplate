"use client";

import { useState } from "react";
import { AssignRoleModal } from "@/features/users/components/AssignRoleModal";
import { UserModal } from "@/features/users/components/UserModal";
import { useDeleteUser, useUsers } from "@/features/users/hooks/useUsers";
import { PermissionGate } from "@/shared/components/guard/PermissionGate";
import { Badge, Button } from "@/shared/components/ui";
import { getErrorMessage } from "@/shared/lib/api-error";
import type { UserWithRoles } from "@/shared/types";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading } = useUsers(page);
  const deleteUser = useDeleteUser();

  const users = data?.data ?? [];
  const meta = data?.meta;

  const openCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const openEdit = (user: UserWithRoles) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const openRoles = (user: UserWithRoles) => {
    setSelectedUser(user);
    setRoleModalOpen(true);
  };

  const handleDelete = async (user: UserWithRoles) => {
    if (!confirm(`Delete user "${user.name}"?`)) return;
    setDeleteError(null);
    try {
      await deleteUser.mutateAsync(user.id);
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">{meta ? `${meta.total} total users` : ""}</p>
        </div>
        <PermissionGate permission="users:create">
          <Button onClick={openCreate}>+ Create User</Button>
        </PermissionGate>
      </div>

      {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Status", "Roles", "Created", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.is_active ? "success" : "danger"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((r) => (
                        <Badge key={r}>{r}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <PermissionGate permission="users:update">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(user)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openRoles(user)}>
                          Roles
                        </Button>
                      </PermissionGate>
                      <PermissionGate permission="users:delete">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(user)}
                          isLoading={deleteUser.isPending}
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

      {meta && meta.total > meta.limit && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPage((p) => p + 1)}
              disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <UserModal isOpen={modalOpen} onClose={() => setModalOpen(false)} user={selectedUser} />

      {selectedUser && (
        <AssignRoleModal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} user={selectedUser} />
      )}
    </div>
  );
}
