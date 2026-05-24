'use client'

import { useUsers } from '@/features/users/hooks/useUsers'
import { useRoles } from '@/features/roles/hooks/useRoles'
import { usePermissionList } from '@/features/permissions/hooks/usePermissionsCrud'
import { useAuditLogs } from '@/features/audit-logs/hooks/useAuditLogs'

export function useDashboardStats() {
  const usersQuery = useUsers(1, 50)
  const rolesQuery = useRoles()
  const permissionsQuery = usePermissionList()
  const logsQuery = useAuditLogs({ page: 1, limit: 5 })

  const users = usersQuery.data?.data ?? []
  const totalUsers = usersQuery.data?.meta?.total ?? users.length
  const roles = rolesQuery.data ?? []
  const permissions = permissionsQuery.data ?? []
  const recentLogs = logsQuery.data?.data ?? []

  const isLoading =
    usersQuery.isLoading ||
    rolesQuery.isLoading ||
    permissionsQuery.isLoading ||
    logsQuery.isLoading

  return {
    users,
    totalUsers,
    roles,
    totalRoles: roles.length,
    permissions,
    totalPermissions: permissions.length,
    recentLogs,
    isLoading,
  }
}
