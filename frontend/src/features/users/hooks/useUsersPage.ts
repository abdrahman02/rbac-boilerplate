"use client";

import { useCallback, useMemo, useState } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { useDebounce, usePermission } from "@/shared/hooks";
import type { UserWithRoles } from "@/shared/types";
import type { FilterState } from "../types";
import { useDeleteUser, useRemoveRole, useUsers } from "./useUsers";

const EMPTY_FILTER: FilterState = { role: "", status: "" };

export function useUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER);

  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [assigningUser, setAssigningUser] = useState<UserWithRoles | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserWithRoles | null>(null);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 400);
  const { data } = useUsers(page, 10, debouncedSearch, filters.role, filters.status);
  const isFetching = useIsFetching({ queryKey: ["users"] }) > 0;

  const { data: roles = [] } = useRoles();
  const deleteUser = useDeleteUser();
  const removeRole = useRemoveRole();

  const canCreate = usePermission("users:create");
  const canEdit = usePermission("users:update");
  const canDelete = usePermission("users:delete");

  const users = useMemo(() => data?.data ?? [], [data]);
  const meta = data?.meta;

  const activeFilterCount = (filters.role ? 1 : 0) + (filters.status ? 1 : 0);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  }, [queryClient]);

  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const handleFiltersChange = useCallback((f: FilterState) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(EMPTY_FILTER);
    setPage(1);
  }, []);

  const openCreate = useCallback(() => {
    setEditingUser(null);
    setUserModalOpen(true);
  }, []);

  const openEdit = useCallback((user: UserWithRoles) => {
    setEditingUser(user);
    setUserModalOpen(true);
  }, []);

  const closeUserModal = useCallback(() => setUserModalOpen(false), []);

  const openAssignRoles = useCallback((user: UserWithRoles) => setAssigningUser(user), []);
  const closeAssignRoles = useCallback(() => setAssigningUser(null), []);

  const openConfirmDelete = useCallback((user: UserWithRoles) => setDeletingUser(user), []);
  const closeConfirmDelete = useCallback(() => setDeletingUser(null), []);

  const handleCopyUserId = useCallback((userId: number) => {
    navigator.clipboard.writeText(String(userId)).catch(() => {});
  }, []);

  const handleRemoveRole = useCallback(
    async (user: UserWithRoles, roleName: string) => {
      const role = roles.find((r) => r.name === roleName);
      if (!role) return;
      try {
        await removeRole.mutateAsync({ userId: user.id, roleId: role.id });
      } catch {
        // API error silently ignored; list won't update if request failed
      }
    },
    [roles, removeRole],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingUser) return;
    try {
      await deleteUser.mutateAsync(deletingUser.id);
      setDeletingUser(null);
    } catch {
      // Error shown via isLoading/disabled state; keep modal open for retry
    }
  }, [deletingUser, deleteUser]);

  return {
    // list state
    page,
    setPage,
    search,
    filters,
    // modal state
    editingUser,
    isUserModalOpen,
    assigningUser,
    deletingUser,
    // data
    users,
    meta,
    roles,
    isFetching,
    // permissions
    canCreate,
    canEdit,
    canDelete,
    // derived
    activeFilterCount,
    clearFilters: activeFilterCount > 0 ? handleClearFilters : undefined,
    isDeletePending: deleteUser.isPending,
    // handlers
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
  };
}
