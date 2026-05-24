export interface RecentActivityItem {
  id: number
  action: string
  resourceType: string
  resourceId: number | null
  userName: string | null
  createdAt: string
}

export interface DashboardStats {
  totalUsers: number
  newUsersThisWeek: number
  inactiveUsers: number
  totalRoles: number
  totalPermissionsAssigned: number
  totalPermissions: number
  recentActivity: RecentActivityItem[]
}
