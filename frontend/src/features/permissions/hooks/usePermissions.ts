"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import type { PaginatedResponse, Permission } from "@/shared/types";

interface CreatePermissionPayload {
  name: string;
  description?: string;
}

interface UpdatePermissionPayload {
  name?: string;
  description?: string;
}

interface PermissionListParams {
  page?: number;
  limit?: number;
  search?: string;
  usage?: string;
}

export function usePermissionList(params?: PermissionListParams) {
  const { page = 1, limit = 10, search, usage } = params ?? {};
  return useQuery<PaginatedResponse<Permission>>({
    queryKey: ["permissions", { page, limit, search, usage }],
    queryFn: async () => {
      const res = await apiClient.get("/permissions", { params: { page, limit, search, usage } });
      return res.data;
    },
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePermissionPayload) => {
      const res = await apiClient.post("/permissions", payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["permissions"] }),
  });
}

export function useUpdatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdatePermissionPayload }) => {
      const res = await apiClient.patch(`/permissions/${id}`, payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["permissions"] }),
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/permissions/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["permissions"] }),
  });
}

interface ExportPermissionsParams {
  search: string;
  usage: string;
}

export function useExportPermissions() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: ExportPermissionsParams) => {
      const res = await apiClient.get<Blob>("/permissions/export", {
        responseType: "blob",
        params,
      });
      const url = URL.createObjectURL(res.data);
      const dateStr = new Date().toISOString().slice(0, 10);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `permissions-${dateStr}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    },
    onError: (err) => toast.error("Export failed", { description: getErrorMessage(err) }),
  });

  const exportPermissions = useCallback((params: ExportPermissionsParams) => mutate(params), [mutate]);
  return { exportPermissions, isExporting: isPending };
}
