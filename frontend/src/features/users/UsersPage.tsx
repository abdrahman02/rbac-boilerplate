"use client";

import { ConfirmDeleteModal, PageHeader } from "@/shared/components/common";
import { Pagination } from "@/shared/components/ui";
import { AssignRoleModal } from "./components/AssignRoleModal";
import { UserModal } from "./components/UserModal/UserModal";
import { UserTable } from "./components/UserTable";
import { UserToolbar } from "./components/UserToolbar/UserToolbar";
import { useUsersPage } from "./hooks/useUsersPage";

export function UsersPage() {
  const {
    page,
    setPage,
    search,
    filters,
    editingUser,
    isUserModalOpen,
    assigningUser,
    deletingUser,
    users,
    meta,
    roles,
    isFetching,
    canCreate,
    canEdit,
    canDelete,
    activeFilterCount,
    clearFilters,
    handleRefresh,
    handleSearchChange,
    handleFiltersChange,
    openCreate,
    openEdit,
    closeUserModal,
    openAssignRoles,
    closeAssignRoles,
    openConfirmDelete,
    closeConfirmDelete,
    handleCopyUserId,
    handleRemoveRole,
    handleConfirmDelete,
    isDeletePending,
  } = useUsersPage();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Users"
        description="People who can sign into this workspace, and the roles assigned to them."
      />

      <UserToolbar
        search={search}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        activeFilterCount={activeFilterCount}
        onClearFilters={clearFilters}
        roles={roles}
        canCreate={canCreate}
        isFetching={isFetching}
        onAddUser={openCreate}
        onRefresh={handleRefresh}
      />

      <UserTable
        users={users}
        isFetching={isFetching}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={openEdit}
        onManageRoles={openAssignRoles}
        onDelete={openConfirmDelete}
        onRemoveRole={handleRemoveRole}
        onCopyUserId={handleCopyUserId}
      />

      {meta && <Pagination page={page} pageSize={meta.limit} total={meta.total} onPageChange={setPage} label="users" />}

      <UserModal isOpen={isUserModalOpen} onClose={closeUserModal} user={editingUser} />

      {assigningUser && <AssignRoleModal isOpen={!!assigningUser} onClose={closeAssignRoles} user={assigningUser} />}

      {deletingUser && (
        <ConfirmDeleteModal
          isOpen={!!deletingUser}
          onClose={closeConfirmDelete}
          onConfirm={handleConfirmDelete}
          title={`Delete ${deletingUser.name}?`}
          description="This will permanently remove their account and revoke all active sessions."
          confirmText={deletingUser.email}
          confirmLabel="Delete user"
          isLoading={isDeletePending}
        />
      )}
    </div>
  );
}
