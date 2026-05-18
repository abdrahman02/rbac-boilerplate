'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import { getErrorMessage } from '@/shared/lib/api-error'
import type { Permission } from '@/shared/types'

interface CreatePermissionPayload {
  name: string
  description?: string
}

interface UpdatePermissionPayload {
  name?: string
  description?: string
}

export function usePermissionList() {
  return useQuery<Permission[]>({
    queryKey: ['permissions'],
    queryFn: async () => {
      const res = await apiClient.get('/permissions')
      return res.data
    },
  })
}

export function useCreatePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreatePermissionPayload) => {
      const res = await apiClient.post('/permissions', payload)
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions'] }),
    onError: (err) => getErrorMessage(err),
  })
}

export function useUpdatePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdatePermissionPayload }) => {
      const res = await apiClient.patch(`/permissions/${id}`, payload)
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions'] }),
    onError: (err) => getErrorMessage(err),
  })
}

export function useDeletePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/permissions/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions'] }),
    onError: (err) => getErrorMessage(err),
  })
}
