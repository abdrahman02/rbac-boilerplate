"use client";

import { useState } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { Pagination } from "@/shared/components/ui";
import { useDebounce, usePermission } from "@/shared/hooks";
import type { UserWithRoles } from "@/shared/types";
import { useDeleteUser, useRemoveRole, useUsers } from "../hooks/useUsers";
import { AssignRoleModal } from "./AssignRoleModal";
import { ConfirmDeleteModal } from "@/shared/components/common";
import { UserModal } from "./UserModal";
import { UserTable } from "./UserTable";
import { UserToolbar } from "./UserToolbar";

interface FilterState {
  role: string;
  status: string;
}

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({ role: "", status: "" });

  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [assigningUser, setAssigningUser] = useState<UserWithRoles | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserWithRoles | null>(null);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 400);
  const { data } = useUsers(page, 10, debouncedSearch, filters.role, filters.status);
  const isFetching = useIsFetching({ queryKey: ["users"] }) > 0;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };
  const { data: roles = [] } = useRoles();
  const deleteUser = useDeleteUser();
  const removeRole = useRemoveRole();

  const canCreate = usePermission("users:create");
  const canEdit = usePermission("users:update");
  const canDelete = usePermission("users:delete");

  const users = data?.data ?? [];
  const meta = data?.meta;

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const handleFiltersChange = (f: FilterState) => {
    setFilters(f);
    setPage(1);
  };

  const openCreate = () => {
    setEditingUser(null);
    setUserModalOpen(true);
  };

  const openEdit = (user: UserWithRoles) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  const handleRemoveRole = async (user: UserWithRoles, roleName: string) => {
    const role = roles.find((r) => r.name === roleName);
    if (!role) return;
    try {
      await removeRole.mutateAsync({ userId: user.id, roleId: role.id });
    } catch {
      // API error silently ignored; the list will not update if the request failed
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser.mutateAsync(deletingUser.id);
      setDeletingUser(null);
    } catch {
      // Error is shown by the isLoading/disabled state; keep modal open for retry
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          People who can sign into this workspace, and the roles assigned to them.
        </p>
      </div>

      {/* Toolbar: search + filters + actions */}
      <UserToolbar
        search={search}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        roles={roles}
        canCreate={canCreate}
        isFetching={isFetching}
        onAddUser={openCreate}
        onRefresh={handleRefresh}
      />

      {/* Users table */}
      <UserTable
        users={users}
        isFetching={isFetching}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={openEdit}
        onManageRoles={(user) => setAssigningUser(user)}
        onDelete={(user) => setDeletingUser(user)}
        onRemoveRole={handleRemoveRole}
      />

      {/* Pagination */}
      {meta && (
        <Pagination
          page={page}
          pageSize={meta.limit}
          total={meta.total}
          onPageChange={setPage}
          label="users"
        />
      )}

      {/* Create / Edit user modal */}
      <UserModal isOpen={isUserModalOpen} onClose={() => setUserModalOpen(false)} user={editingUser} />

      {/* Assign roles modal */}
      {assigningUser && (
        <AssignRoleModal
          isOpen={!!assigningUser}
          onClose={() => setAssigningUser(null)}
          user={assigningUser}
        />
      )}

      {/* Confirm delete modal */}
      {deletingUser && (
        <ConfirmDeleteModal
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleConfirmDelete}
          title={`Delete ${deletingUser.name}?`}
          description="This will permanently remove their account and revoke all active sessions."
          confirmText={deletingUser.email}
          confirmLabel="Delete user"
          isLoading={deleteUser.isPending}
        />
      )}
    </div>
  );
}
