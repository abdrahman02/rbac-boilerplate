import * as repo from '../repositories/dashboard.repository.js'
import type { ApiResponse } from '../types/index.js'

interface RecentActivityDto {
  id: number
  action: string
  resourceType: string
  resourceId: number | null
  userName: string | null
  createdAt: string
}

export interface DashboardStatsDto {
  totalUsers: number
  newUsersThisWeek: number
  inactiveUsers: number
  totalRoles: number
  totalPermissionsAssigned: number
  totalPermissions: number
  recentActivity: RecentActivityDto[]
}

/**
 * Fetches dashboard statistics for the last 7 days and maps raw DB data to DTO.
 * Converts Date objects to ISO 8601 strings for serialization.
 */
export async function getDashboardStats(): Promise<ApiResponse<DashboardStatsDto>> {
  const sinceDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const raw = await repo.getDashboardStats(sinceDate)

  return {
    success: true,
    data: {
      totalUsers: raw.totalUsers,
      newUsersThisWeek: raw.newUsersThisWeek,
      inactiveUsers: raw.inactiveUsers,
      totalRoles: raw.totalRoles,
      totalPermissionsAssigned: raw.totalPermissionsAssigned,
      totalPermissions: raw.totalPermissions,
      recentActivity: raw.recentActivity.map((item) => ({
        id: item.id,
        action: item.action,
        resourceType: item.resourceType,
        resourceId: item.resourceId,
        userName: item.userName,
        createdAt: item.createdAt.toISOString(),
      })),
    },
    message: null,
  }
}
