"use client";

import { useMemo } from "react";
import { useAuth } from "@/shared/hooks";
import { STAT_ICONS } from "../DashboardPage.constants";
import type { StatCardConfig } from "../types";
import { useDashboardStats, useExportDashboard } from "./useDashboard";

export function useDashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading, isError: isStatsError } = useDashboardStats();
  const { exportDashboard, isExporting } = useExportDashboard();

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const statCards = useMemo<StatCardConfig[]>(
    () => [
      {
        label: "Total users",
        value: stats?.totalUsers ?? 0,
        delta: stats ? `+${stats.newUsersThisWeek} this week` : undefined,
        sub: stats ? `${stats.inactiveUsers} inactive` : undefined,
        icon: STAT_ICONS.users,
      },
      {
        label: "Active roles",
        value: stats?.totalRoles ?? 0,
        sub: stats ? `${stats.totalPermissionsAssigned} permissions assigned` : undefined,
        icon: STAT_ICONS.roles,
      },
      {
        label: "Permissions",
        value: stats?.totalPermissions ?? 0,
        sub: "Across all roles",
        icon: STAT_ICONS.permissions,
      },
      {
        label: "Events",
        value: stats?.totalEvents ?? 0,
        sub: stats ? `${stats.eventsToday} events today` : undefined,
        icon: STAT_ICONS.events,
      },
    ],
    [stats],
  );

  return {
    firstName,
    statCards,
    recentActivity: stats?.recentActivity ?? [],
    isLoading,
    isStatsError,
    isExporting,
    exportDashboard,
  };
}
