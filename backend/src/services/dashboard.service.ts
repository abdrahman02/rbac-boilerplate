import { buildDashboardWorkbook, type DashboardExportData } from "../lib/exporters/dashboard-exporter.js";
import type { RoleDistributionItem } from "../repositories/dashboard.repository.js";
import * as repo from "../repositories/dashboard.repository.js";
import * as roleRepo from "../repositories/role.repository.js";
import * as userRepo from "../repositories/user.repository.js";
import type { ApiResponse } from "../types/index.js";

interface RecentActivityDto {
  id: number;
  action: string;
  resourceType: string;
  resourceId: number | null;
  userName: string | null;
  createdAt: string;
}

export interface DashboardStatsDto {
  totalUsers: number;
  newUsersThisWeek: number;
  inactiveUsers: number;
  totalRoles: number;
  totalPermissionsAssigned: number;
  totalPermissions: number;
  totalEvents: number;
  eventsToday: number;
  recentActivity: RecentActivityDto[];
}

const STATS_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Orchestrates dashboard export: fetches stats plus the user/role data the
 * caller is allowed to see, then delegates rendering to the dashboard exporter.
 */
export async function buildExportWorkbook(permissions: string[]): Promise<Buffer> {
  const sinceDate = new Date(Date.now() - STATS_WINDOW_MS);
  const stats = await repo.getDashboardStats(sinceDate);

  const data: DashboardExportData = { stats };
  if (permissions.includes("users:read")) data.users = await userRepo.findAllUsersForExport();
  if (permissions.includes("roles:read")) data.roles = await roleRepo.findAllRolesForExport();

  return buildDashboardWorkbook(data);
}

/**
 * Fetches dashboard statistics for the last 7 days and maps raw DB data to DTO.
 * Converts Date objects to ISO 8601 strings for serialization.
 */
export async function getRoleDistribution(): Promise<ApiResponse<RoleDistributionItem[]>> {
  const data = await repo.getRoleDistribution();
  return { success: true, data, message: null };
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStatsDto>> {
  const sinceDate = new Date(Date.now() - STATS_WINDOW_MS);

  const raw = await repo.getDashboardStats(sinceDate);

  return {
    success: true,
    data: {
      totalUsers: raw.totalUsers,
      newUsersThisWeek: raw.newUsersThisWeek,
      inactiveUsers: raw.inactiveUsers,
      totalRoles: raw.totalRoles,
      totalPermissionsAssigned: raw.totalPermissionsAssigned,
      totalPermissions: raw.totalPermissions,
      totalEvents: raw.totalEvents,
      eventsToday: raw.eventsToday,
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
  };
}
