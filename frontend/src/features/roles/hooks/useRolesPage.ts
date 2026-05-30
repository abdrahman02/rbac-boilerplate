"use client";

import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { usePermissionList } from "@/features/permissions/hooks/usePermissionsCrud";
import { useUsers } from "@/features/users/hooks";
import { usePermission } from "@/shared/hooks";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import type { RoleWithPermissions, UserWithRoles } from "@/shared/types";
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
  const { data: allRoles = [], isLoading, isError } = useRoles({ limit: -1 });
  const isFetching = useIsFetching({ queryKey: ["roles"] }) > 0;
  const deleteRole = useDeleteRole();

  const { data: permissionsData } = usePermissionList();
  const filterPermissions = useMemo(() => (permissionsData ?? []).map((p) => p.name).sort(), [permissionsData]);

  const { data: allUsersData } = useUsers({ page: 1, limit: -1 });
  const allUsers = useMemo<UserWithRoles[]>(() => allUsersData?.data ?? [], [allUsersData]);

  const roleUserMap = useMemo<Record<string, UserWithRoles[]>>(() => {
    const map: Record<string, UserWithRoles[]> = {};
    for (const user of allUsers) {
      for (const roleName of user.roles) {
        if (!map[roleName]) map[roleName] = [];
        map[roleName].push(user);
      }
    }
    return map;
  }, [allUsers]);

  const canCreate = usePermission("roles:create");
  const canEdit = usePermission("roles:update");
  const canDelete = usePermission("roles:delete");

  const filteredRoles = useMemo(() => {
    return allRoles.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.permission && !r.permissions.includes(filters.permission)) return false;
      return true;
    });
  }, [allRoles, search, filters]);

  const pagedRoles = useMemo(
    () => filteredRoles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredRoles, page],
  );

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
    roles: pagedRoles,
    total: filteredRoles.length,
    pageSize: PAGE_SIZE,
    filterPermissions,
    roleUserMap,
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
