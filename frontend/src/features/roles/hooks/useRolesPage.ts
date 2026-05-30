"use client";

import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { usePermissionList } from "@/features/permissions/hooks/usePermissions";
import { useDebounce, usePermission } from "@/shared/hooks";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import type { RoleWithPermissions } from "@/shared/types";
import type { RolesFilterState } from "../types";
import { useDeleteRole, useRoles } from "./useRoles";

const PAGE_SIZE = 10;
const EMPTY_FILTER: RolesFilterState = { permission: "" };

export function useRolesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<RolesFilterState>(EMPTY_FILTER);

  const [editingRole, setEditingRole] = useState<RoleWithPermissions | null>(null);
  const [isRoleModalOpen, setRoleModalOpen] = useState(false);
  const [assigningRole, setAssigningRole] = useState<RoleWithPermissions | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleWithPermissions | null>(null);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 400);

  // Main paginated data — server handles filtering and pagination
  const { data, isLoading, isError } = useRoles({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    permission: filters.permission || undefined,
  });
  const roles = useMemo(() => data?.data ?? [], [data]);
  const total = data?.meta.total ?? 0;

  const isFetching = useIsFetching({ queryKey: ["roles"] }) > 0;
  const deleteRole = useDeleteRole();

  // Filter options — all permissions without pagination
  const { data: permissionsData } = usePermissionList({ limit: -1 });
  const filterPermissions = useMemo(() => (permissionsData?.data ?? []).map((p) => p.name).sort(), [permissionsData]);

  const canCreate = usePermission("roles:create");
  const canEdit = usePermission("roles:update");
  const canDelete = usePermission("roles:delete");

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["roles"] });
  }, [queryClient]);

  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const handleFiltersChange = useCallback((f: RolesFilterState) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(EMPTY_FILTER);
    setPage(1);
  }, []);

  const openCreate = useCallback(() => {
    setEditingRole(null);
    setRoleModalOpen(true);
  }, []);

  const openEdit = useCallback((role: RoleWithPermissions) => {
    setEditingRole(role);
    setRoleModalOpen(true);
  }, []);

  const closeRoleModal = useCallback(() => setRoleModalOpen(false), []);
  const openAssignPermissions = useCallback((role: RoleWithPermissions) => setAssigningRole(role), []);
  const closeAssignPermissions = useCallback(() => setAssigningRole(null), []);
  const openConfirmDelete = useCallback((role: RoleWithPermissions) => setDeletingRole(role), []);
  const closeConfirmDelete = useCallback(() => setDeletingRole(null), []);

  const handleCopyRoleId = useCallback((roleId: number) => {
    navigator.clipboard.writeText(String(roleId)).catch(() => {});
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deletingRole) return;
    deleteRole.mutate(deletingRole.id, {
      onSuccess: () => {
        setDeletingRole(null);
        toast.success("Role deleted", { description: deletingRole.name });
      },
      onError: (err) => toast.error("Failed to delete role", { description: getErrorMessage(err) }),
    });
  }, [deletingRole, deleteRole]);

  const activeFilterCount = filters.permission ? 1 : 0;

  return {
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
    pageSize: PAGE_SIZE,
    filterPermissions,
    isLoading,
    isError,
    isFetching,
    canCreate,
    canEdit,
    canDelete,
    activeFilterCount,
    clearFilters: activeFilterCount > 0 ? handleClearFilters : undefined,
    isDeletePending: deleteRole.isPending,
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
  };
}
