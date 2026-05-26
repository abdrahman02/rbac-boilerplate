"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import type { Permission } from "@/shared/types";

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
}

export function usePermissionList(params?: PermissionListParams) {
  const { page = 1, limit = -1, search } = params ?? {};
  return useQuery<Permission[]>({
    queryKey: ["permissions", { page, limit, search }],
    queryFn: async () => {
      const res = await apiClient.get("/permissions", { params: { page, limit, search } });
      return res.data.data;
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
