"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { apiClient } from "@/shared/lib/api-client";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import type { PaginatedResponse, RoleWithPermissions } from "@/shared/types";

interface CreateRolePayload {
  name: string;
  description?: string;
}

interface UpdateRolePayload {
  name?: string;
  description?: string;
}

interface RoleListParams {
  page?: number;
  limit?: number;
  search?: string;
  permission?: string;
}

export function useRoles(params?: RoleListParams) {
  const { page = 1, limit = 10, search, permission } = params ?? {};
  return useQuery<PaginatedResponse<RoleWithPermissions>>({
    queryKey: ["roles", { page, limit, search, permission }],
    queryFn: async () => {
      const res = await apiClient.get("/roles", { params: { page, limit, search, permission } });
      return res.data;
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateRolePayload) => {
      const res = await apiClient.post("/roles", payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateRolePayload }) => {
      const res = await apiClient.patch(`/roles/${id}`, payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/roles/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useAssignPermissionToRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roleId, permissionId }: { roleId: number; permissionId: number }) => {
      await apiClient.post(`/roles/${roleId}/permissions`, { permission_id: permissionId });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useRemovePermissionFromRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roleId, permissionId }: { roleId: number; permissionId: number }) => {
      await apiClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useSyncRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roleId, permissionIds }: { roleId: number; permissionIds: number[] }) => {
      const res = await apiClient.put(`/roles/${roleId}/permissions`, { permission_ids: permissionIds });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
}

interface ExportRolesParams {
  search: string;
  permission: string;
}

export function useExportRoles() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: ExportRolesParams) => {
      const res = await apiClient.get<Blob>("/roles/export", {
        responseType: "blob",
        params,
      });
      const url = URL.createObjectURL(res.data);
      const dateStr = new Date().toISOString().slice(0, 10);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `roles-${dateStr}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    },
    onError: (err) => toast.error("Export failed", { description: getErrorMessage(err) }),
  });

  const exportRoles = useCallback((params: ExportRolesParams) => mutate(params), [mutate]);
  return { exportRoles, isExporting: isPending };
}
