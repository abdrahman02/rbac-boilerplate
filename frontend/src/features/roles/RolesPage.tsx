"use client";

import { ConfirmDeleteModal, PageHeader } from "@/shared/components/common";
import { Pagination } from "@/shared/components/ui";
import { AssignPermissionModal } from "./components/AssignPermissionModal";
import { RoleModal } from "./components/RoleModal";
import { RoleTable } from "./components/RoleTable";
import { RoleToolbar } from "./components/RoleToolbar";
import { useRolesPage } from "./hooks/useRolesPage";

export function RolesPage() {
  const {
    page,
    setPage,
    search,
    filters,
    editingRole,
    isRoleModalOpen,
    assigningRole,
    deletingRole,
    roles,
    total,
    pageSize,
    permissions,
    roleUserMap,
    isFetching,
    isError,
    canCreate,
    canEdit,
    canDelete,
    activeFilterCount,
    clearFilters,
    isDeletePending,
    handleRefresh,
    handleSearchChange,
    handleFiltersChange,
    openCreate,
    openEdit,
    closeRoleModal,
    openAssignPermissions,
    closeAssignPermissions,
    openConfirmDelete,
    closeConfirmDelete,
    handleCopyRoleId,
    handleConfirmDelete,
  } = useRolesPage();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Roles" description="Logical groupings of permissions. Assign roles to users in bulk." />

      <RoleToolbar
        search={search}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        activeFilterCount={activeFilterCount}
        onClearFilters={clearFilters}
        permissions={permissions}
        canCreate={canCreate}
        isFetching={isFetching}
        onAddRole={openCreate}
        onRefresh={handleRefresh}
      />

      <RoleTable
        roles={roles}
        isFetching={isFetching}
        isError={isError}
        canEdit={canEdit}
        canDelete={canDelete}
        roleUserMap={roleUserMap}
        onEdit={openEdit}
        onManagePermissions={openAssignPermissions}
        onDelete={openConfirmDelete}
        onCopyRoleId={handleCopyRoleId}
      />

      {total > pageSize && (
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} label="roles" />
      )}

      <RoleModal isOpen={isRoleModalOpen} onClose={closeRoleModal} role={editingRole} />

      {assigningRole && (
        <AssignPermissionModal isOpen={!!assigningRole} onClose={closeAssignPermissions} role={assigningRole} />
      )}

      {deletingRole && (
        <ConfirmDeleteModal
          isOpen={!!deletingRole}
          onClose={closeConfirmDelete}
          onConfirm={handleConfirmDelete}
          title={`Delete ${deletingRole.name}?`}
          description={`This will permanently remove the "${deletingRole.name}" role and revoke it from all users who currently hold it.`}
          confirmText={deletingRole.name}
          confirmLabel="Delete role"
          isLoading={isDeletePending}
        />
      )}
    </div>
  );
}
