'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import { getErrorMessage } from '@/shared/lib/api-error'
import type { RoleWithPermissions } from '@/shared/types'

interface CreateRolePayload {
  name: string
  description?: string
}

interface UpdateRolePayload {
  name?: string
  description?: string
}

export function useRoles() {
  return useQuery<RoleWithPermissions[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await apiClient.get('/roles')
      return res.data.data
    },
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateRolePayload) => {
      const res = await apiClient.post('/roles', payload)
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
    onError: (err) => getErrorMessage(err),
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateRolePayload }) => {
      const res = await apiClient.patch(`/roles/${id}`, payload)
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
    onError: (err) => getErrorMessage(err),
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/roles/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
    onError: (err) => getErrorMessage(err),
  })
}

export function useAssignPermissionToRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ roleId, permissionId }: { roleId: number; permissionId: number }) => {
      await apiClient.post(`/roles/${roleId}/permissions`, { permission_id: permissionId })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
    onError: (err) => getErrorMessage(err),
  })
}

export function useRemovePermissionFromRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ roleId, permissionId }: { roleId: number; permissionId: number }) => {
      await apiClient.delete(`/roles/${roleId}/permissions/${permissionId}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
    onError: (err) => getErrorMessage(err),
  })
}
