"use client";

import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useDebounce, usePermission } from "@/shared/hooks";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import type { Permission } from "@/shared/types";
import type { PermissionsFilterState } from "../types";
import { useDeletePermission, useExportPermissions, usePermissionList } from "./usePermissions";

const PAGE_SIZE = 10;
const EMPTY_FILTER: PermissionsFilterState = { usage: "" };

export function usePermissionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<PermissionsFilterState>(EMPTY_FILTER);

  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);
  const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 400);
  const deletePermission = useDeletePermission();
  const { exportPermissions, isExporting } = useExportPermissions();

  const handleExport = useCallback(() => {
    exportPermissions({ search: debouncedSearch, usage: filters.usage || "" });
  }, [exportPermissions, debouncedSearch, filters.usage]);

  // Main paginated data — server handles filtering and pagination
  const { data, isLoading, isError } = usePermissionList({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    usage: filters.usage || undefined,
  });
  const permissions = useMemo(() => data?.data ?? [], [data]);
  const total = data?.meta.total ?? 0;

  const isFetching = useIsFetching({ queryKey: ["permissions"] }) > 0;

  const canCreate = usePermission("permissions:create");
  const canEdit = usePermission("permissions:update");
  const canDelete = usePermission("permissions:delete");

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["permissions"] });
  }, [queryClient]);

  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const handleFiltersChange = useCallback((f: PermissionsFilterState) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(EMPTY_FILTER);
    setPage(1);
  }, []);

  const openCreate = useCallback(() => {
    setEditingPermission(null);
    setPermissionModalOpen(true);
  }, []);

  const openEdit = useCallback((permission: Permission) => {
    setEditingPermission(permission);
    setPermissionModalOpen(true);
  }, []);

  const closePermissionModal = useCallback(() => setPermissionModalOpen(false), []);

  const openConfirmDelete = useCallback((permission: Permission) => setDeletingPermission(permission), []);
  const closeConfirmDelete = useCallback(() => setDeletingPermission(null), []);

  const handleCopyPermissionId = useCallback((id: number) => {
    navigator.clipboard.writeText(String(id)).catch(() => {});
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deletingPermission) return;
    deletePermission.mutate(deletingPermission.id, {
      onSuccess: () => {
        setDeletingPermission(null);
        toast.success("Permission deleted", { description: deletingPermission.name });
      },
      onError: (err) => toast.error("Failed to delete permission", { description: getErrorMessage(err) }),
    });
  }, [deletingPermission, deletePermission]);

  const activeFilterCount = filters.usage ? 1 : 0;

  return {
    page,
    setPage,
    search,
    filters,
    editingPermission,
    isPermissionModalOpen,
    deletingPermission,
    permissions,
    total,
    pageSize: PAGE_SIZE,
    isLoading,
    isError,
    isFetching,
    canCreate,
    canEdit,
    canDelete,
    activeFilterCount,
    clearFilters: activeFilterCount > 0 ? handleClearFilters : undefined,
    isDeletePending: deletePermission.isPending,
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
    handleExport,
    isExporting,
  };
}
