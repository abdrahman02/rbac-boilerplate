"use client";

import { ConfirmDeleteModal, PageHeader } from "@/shared/components/common";
import { Pagination } from "@/shared/components/ui";
import { PermissionModal } from "./components/PermissionModal";
import { PermissionTable } from "./components/PermissionTable";
import { PermissionToolbar } from "./components/PermissionToolbar";
import { usePermissionsPage } from "./hooks";

export function PermissionsPage() {
  const {
    page,
    setPage,
    search,
    filters,
    editingPermission,
    isPermissionModalOpen,
    deletingPermission,
    permissions,
    total,
    pageSize,
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
    closePermissionModal,
    openConfirmDelete,
    closeConfirmDelete,
    handleCopyPermissionId,
    handleConfirmDelete,
  } = usePermissionsPage();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Permissions" description="Atomic capabilities. Group them into roles, then assign to users." />

      <PermissionToolbar
        search={search}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        activeFilterCount={activeFilterCount}
        onClearFilters={clearFilters}
        canCreate={canCreate}
        isFetching={isFetching}
        onAddPermission={openCreate}
        onRefresh={handleRefresh}
      />

      <PermissionTable
        permissions={permissions}
        isFetching={isFetching}
        isError={isError}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={openEdit}
        onDelete={openConfirmDelete}
        onCopyPermissionId={handleCopyPermissionId}
      />

      {total > pageSize && (
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} label="permissions" />
      )}

      <PermissionModal isOpen={isPermissionModalOpen} onClose={closePermissionModal} permission={editingPermission} />

      {deletingPermission && (
        <ConfirmDeleteModal
          isOpen={!!deletingPermission}
          onClose={closeConfirmDelete}
          onConfirm={handleConfirmDelete}
          title={`Delete ${deletingPermission.name}?`}
          description={`This will be removed from ${deletingPermission.roles.length} role(s).`}
          confirmText={deletingPermission.name}
          confirmLabel="Delete permission"
          isLoading={isDeletePending}
        />
      )}
    </div>
  );
}
