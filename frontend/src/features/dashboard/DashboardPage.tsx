"use client";

import { ChevronRight, Download, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/common";
import { Button, buttonVariants } from "@/shared/components/ui";
import { ActivityFeed } from "./components/ActivityFeed";
import { QuickActions } from "./components/QuickActions";
import { RoleDistribution } from "./components/RoleDistribution";
import { StatCard } from "./components/StatCard";
import { useDashboardPage } from "./hooks";
import { useAnyPermission, usePermission } from "@/shared/hooks";

export function DashboardPage() {
  const { firstName, activePermissions, statCards, recentActivity, isLoading, isStatsError, isExporting, exportDashboard } =
    useDashboardPage();

  const canInviteUser = usePermission("users:create");
  const canViewAuditLogs = usePermission("audit_logs:read");
  const hasAnyQuickAction = useAnyPermission(["users:create", "roles:create", "permissions:create", "audit_logs:read"]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's what's happened in your workspace since you last signed in."
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={exportDashboard} disabled={isExporting}>
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {isExporting ? "Exporting..." : "Export"}
          </Button>
          {canInviteUser && (
            <Link href="/users" className={buttonVariants({ size: "sm", className: "gap-1.5" })}>
              <UserPlus size={14} />
              Invite user
            </Link>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} isLoading={isLoading} isError={isStatsError} />
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
            {canViewAuditLogs && (
              <Link
                href="/audit-logs"
                className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1.5 text-sm" })}
              >
                View all
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ActivityFeed logs={recentActivity} isLoading={isLoading} isError={isStatsError} />
          </div>
        </div>

        {/* Right column — QuickActions fixed, RoleDistribution fills remaining height */}
        <div className="flex flex-col gap-4">
          {hasAnyQuickAction && (
            <div className="rounded-xl border border-border bg-card shadow-sm p-5 shrink-0">
              <h2 className="text-[15px] font-semibold mb-3">Quick actions</h2>
              <QuickActions activePermissions={activePermissions} />
            </div>
          )}

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
