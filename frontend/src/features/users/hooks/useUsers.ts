"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { apiClient } from "@/shared/lib/api-client";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import type { PaginatedResponse, UserWithRoles } from "@/shared/types";

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
  is_active?: boolean;
}

interface UseUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export function useUsers({ page = 1, limit = 10, search = "", role = "", status = "" }: UseUsersParams = {}) {
  return useQuery<PaginatedResponse<UserWithRoles>>({
    queryKey: ["users", page, limit, search, role, status],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (role) params.set("role", role);
      if (status) params.set("status", status);
      const res = await apiClient.get(`/users?${params}`);
      return res.data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const res = await apiClient.post("/users", payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateUserPayload }) => {
      const res = await apiClient.patch(`/users/${id}`, payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/users/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useSyncRoles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, roleIds }: { userId: number; roleIds: number[] }) => {
      const res = await apiClient.put(`/users/${userId}/roles`, { role_ids: roleIds });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useRemoveRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      await apiClient.delete(`/users/${userId}/roles/${roleId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

interface ExportUsersParams {
  search: string;
  role: string;
  status: string;
}

export function useExportUsers() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (params: ExportUsersParams) => {
      const res = await apiClient.get<Blob>("/users/export", {
        responseType: "blob",
        params,
      });
      const url = URL.createObjectURL(res.data);
      const dateStr = new Date().toISOString().slice(0, 10);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `users-${dateStr}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    },
    onError: (err) => toast.error("Export failed", { description: getErrorMessage(err) }),
  });

  const exportUsers = useCallback((params: ExportUsersParams) => mutate(params), [mutate]);
  return { exportUsers, isExporting: isPending };
}
