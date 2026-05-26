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
  totalEvents: number
  eventsToday: number
  recentActivity: RecentActivityItem[]
}

const RECENT_ACTIVITY_LIMIT = 20

export async function getDashboardStats(sinceDate: Date): Promise<DashboardStatsRaw> {
  const now = new Date()
  const todayMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

  const [
    totalUsers,
    inactiveUsers,
    newUsersThisWeek,
    totalRoles,
    totalPermissionsAssigned,
    totalPermissions,
    totalEvents,
    eventsToday,
    recentLogs,
  ] = await prisma.$transaction([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null, isActive: false } }),
    prisma.user.count({ where: { deletedAt: null, createdAt: { gte: sinceDate } } }),
    prisma.role.count(),
    prisma.rolePermission.count(),
    prisma.permission.count(),
    prisma.auditLog.count(),
    prisma.auditLog.count({ where: { createdAt: { gte: todayMidnight } } }),
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
    totalEvents,
    eventsToday,
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
