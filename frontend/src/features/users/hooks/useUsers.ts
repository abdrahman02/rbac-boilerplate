"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
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

export function useUsers(page = 1, limit = 10) {
  return useQuery<PaginatedResponse<UserWithRoles>>({
    queryKey: ["users", page, limit],
    queryFn: async () => {
      const res = await apiClient.get(`/users?page=${page}&limit=${limit}`);
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

export function useAssignRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      await apiClient.post(`/users/${userId}/roles`, { role_id: roleId });
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
