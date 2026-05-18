'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import type { AuditLog, PaginatedResponse } from '@/shared/types'

interface AuditLogFilters {
  user_id?: number
  action?: string
  resource_type?: string
  page?: number
  limit?: number
}

export function useAuditLogs(filters: AuditLogFilters = {}) {
  const { page = 1, limit = 20, ...rest } = filters

  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (rest.user_id) params.set('user_id', String(rest.user_id))
  if (rest.action) params.set('action', rest.action)
  if (rest.resource_type) params.set('resource_type', rest.resource_type)

  return useQuery<PaginatedResponse<AuditLog>>({
    queryKey: ['audit-logs', filters],
    queryFn: async () => {
      const res = await apiClient.get(`/audit-logs?${params.toString()}`)
      return res.data
    },
  })
}
