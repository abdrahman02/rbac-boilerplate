'use client'

import Link from 'next/link'
import { Users, Shield, Key, Activity, ChevronRight, Download, UserPlus } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button, buttonVariants } from '@/shared/components/ui'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { StatCard } from './StatCard'
import { ActivityFeed } from './ActivityFeed'
import { QuickActions } from './QuickActions'
import { RoleDistribution } from './RoleDistribution'

export function DashboardPage() {
  const { user } = useAuth()
  const { users, totalUsers, roles, totalRoles, permissions, totalPermissions, recentLogs, isLoading } =
    useDashboardStats()

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {"Here's what's happened in your workspace since you last signed in."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download size={14} />
            Export
          </Button>
          <Link href="/users" className={buttonVariants({ size: 'sm', className: 'gap-1.5' })}>
            <UserPlus size={14} />
            Invite user
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total users"
          value={totalUsers}
          delta="+2 this week"
          sub={`${users.filter((u) => !u.is_active).length} inactive`}
          icon={<Users size={16} />}
          tone="primary"
          isLoading={isLoading}
        />
        <StatCard
          label="Active roles"
          value={totalRoles}
          sub={`${roles.reduce((a, r) => a + r.permissions.length, 0)} permissions assigned`}
          icon={<Shield size={16} />}
          isLoading={isLoading}
        />
        <StatCard
          label="Permissions"
          value={totalPermissions}
          delta="—"
          sub="Across all roles"
          icon={<Key size={16} />}
          isLoading={isLoading}
        />
        <StatCard
          label="Recent events"
          value={recentLogs.length}
          delta="·"
          sub="Last 5 events shown"
          icon={<Activity size={16} />}
          isLoading={isLoading}
        />
      </div>

      {/* Two-column: recent activity + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        {/* Recent activity */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-[15px] font-semibold">Recent activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last five events across the workspace</p>
            </div>
            <Link href="/audit-logs" className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'gap-1.5 text-sm' })}>
              View all
              <ChevronRight size={14} />
            </Link>
          </div>
          <ActivityFeed logs={recentLogs} users={users} isLoading={isLoading} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Quick actions */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-5">
            <h2 className="text-[15px] font-semibold mb-3">Quick actions</h2>
            <QuickActions />
          </div>

          {/* Role distribution */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-5">
            <h2 className="text-[15px] font-semibold mb-3">Role distribution</h2>
            <RoleDistribution roles={roles} users={users} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}
