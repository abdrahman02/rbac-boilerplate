import { prisma } from '../lib/prisma.js'

export interface RecentActivityItem {
  id: number
  action: string
  resourceType: string
  resourceId: number | null
  userName: string | null
  createdAt: Date
}

export interface DashboardStatsRaw {
  totalUsers: number
  inactiveUsers: number
  newUsersThisWeek: number
  totalRoles: number
  totalPermissionsAssigned: number
  totalPermissions: number
  recentActivity: RecentActivityItem[]
}

/**
 * Fetches aggregated dashboard statistics in a single transaction.
 * Includes user counts, role/permission counts, and recent audit activity.
 */
export async function getDashboardStats(): Promise<DashboardStatsRaw> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [
    totalUsers,
    inactiveUsers,
    newUsersThisWeek,
    totalRoles,
    totalPermissionsAssigned,
    totalPermissions,
    recentLogs,
  ] = await prisma.$transaction([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null, isActive: false } }),
    prisma.user.count({ where: { deletedAt: null, createdAt: { gte: sevenDaysAgo } } }),
    prisma.role.count(),
    prisma.rolePermission.count(),
    prisma.permission.count(),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true } } },
    }),
  ])

  return {
    totalUsers,
    inactiveUsers,
    newUsersThisWeek,
    totalRoles,
    totalPermissionsAssigned,
    totalPermissions,
    recentActivity: recentLogs.map((log) => ({
      id: log.id,
      action: log.action,
      resourceType: log.resourceType,
      resourceId: log.resourceId,
      userName: log.user?.fullName ?? null,
      createdAt: log.createdAt,
    })),
  }
}
