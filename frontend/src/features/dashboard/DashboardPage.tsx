"use client";

import { Activity, ChevronRight, Download, Key, Loader2, Shield, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useMemo } from "react";
import { PageHeader } from "@/shared/components/common";
import { Button, buttonVariants } from "@/shared/components/ui";
import { useAuth } from "@/shared/hooks";
import { ActivityFeed } from "./components/ActivityFeed";
import { QuickActions } from "./components/QuickActions";
import { RoleDistribution } from "./components/RoleDistribution";
import { StatCard } from "./components/StatCard";
import { useDashboardStats, useExportDashboard } from "./hooks";

interface StatCardConfig {
  label: string;
  value: number;
  delta?: string;
  sub?: string;
  icon: ReactNode;
}

const STAT_ICONS = {
  users: <Users size={16} />,
  roles: <Shield size={16} />,
  permissions: <Key size={16} />,
  events: <Activity size={16} />,
} as const;

export function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();
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

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's what's happened in your workspace since you last signed in."
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={exportDashboard} disabled={isExporting}>
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {isExporting ? "Exporting..." : "Export"}
          </Button>
          <Link href="/users" className={buttonVariants({ size: "sm", className: "gap-1.5" })}>
            <UserPlus size={14} />
            Invite user
          </Link>
        </div>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} isLoading={isLoading} />
        ))}
      </div>

      {/* Two-column: recent activity + sidebar — fixed height so overflow-y-auto fires */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] xl:h-[600px] gap-4">
        {/* Recent activity — header fixed, feed scrolls to fill remaining height */}
        <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div>
              <h2 className="text-[15px] font-semibold">Recent activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">All recent activity across the workspace</p>
            </div>
            <Link
              href="/audit-logs"
              className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1.5 text-sm" })}
            >
              View all
              <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ActivityFeed logs={stats?.recentActivity ?? []} isLoading={isLoading} />
          </div>
        </div>

        {/* Right column — QuickActions fixed, RoleDistribution fills remaining height */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card shadow-sm p-5 shrink-0">
            <h2 className="text-[15px] font-semibold mb-3">Quick actions</h2>
            <QuickActions />
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col flex-1 overflow-hidden">
            <div className="px-5 pt-5 pb-3 shrink-0">
              <h2 className="text-[15px] font-semibold">Role distribution</h2>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5">
              <RoleDistribution />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
