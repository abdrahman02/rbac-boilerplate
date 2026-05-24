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

const RECENT_ACTIVITY_LIMIT = 5

export async function getDashboardStats(sinceDate: Date): Promise<DashboardStatsRaw> {
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
    prisma.user.count({ where: { deletedAt: null, createdAt: { gte: sinceDate } } }),
    prisma.role.count(),
    prisma.rolePermission.count(),
    prisma.permission.count(),
    prisma.auditLog.findMany({
      take: RECENT_ACTIVITY_LIMIT,
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
