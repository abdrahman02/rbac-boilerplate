import { memo } from 'react'
import type { RecentActivityItem } from '@/shared/types'
import type { VariantProps } from 'tailwind-variants'
import { Avatar, Badge } from '@/shared/components/ui'
import type { badgeVariants } from '@/shared/components/ui/Badge/Badge.variants'
import { formatRelative, formatDateTime } from '@/shared/lib/format-date'

interface ActivityFeedProps {
  logs: RecentActivityItem[]
  isLoading?: boolean
}

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

function getActionBadgeVariant(action: string): BadgeVariant {
  if (action.startsWith('auth.fail')) return 'danger'
  if (action.startsWith('auth')) return 'success'
  if (action.includes('delete')) return 'danger'
  if (action.includes('create')) return 'primary'
  if (action.includes('assign') || action.includes('update')) return 'info'
  return 'default'
}

const ActivityRow = memo(function ActivityRow({ log }: { log: RecentActivityItem }) {
  const displayName = log.userName ?? 'Unknown'
  const variant = getActionBadgeVariant(log.action)

  return (
    <div className="flex items-center gap-3 px-5 py-3 border-t border-border first:border-t-0">
      <Avatar name={displayName} size={28} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] leading-snug">
          <span className="font-semibold">{displayName}</span>
          <span className="text-muted-foreground"> · {log.resourceType.toLowerCase()} </span>
          {log.resourceId !== null && (
            <span className="font-mono text-xs text-muted-foreground">#{log.resourceId}</span>
          )}
        </div>
      </div>
      <Badge variant={variant}>{log.action}</Badge>
      <span
        className="text-xs text-muted-foreground whitespace-nowrap min-w-[52px] text-right"
        title={formatDateTime(log.createdAt)}
      >
        {formatRelative(log.createdAt)}
      </span>
    </div>
  )
})

export const ActivityFeed = memo(function ActivityFeed({ logs, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3 border-t border-border first:border-t-0">
            <div className="w-7 h-7 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              <div className="h-2.5 bg-muted rounded animate-pulse w-1/4" />
            </div>
            <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
            <div className="h-3 w-10 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        No recent activity
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {logs.map((log) => (
        <ActivityRow key={log.id} log={log} />
      ))}
    </div>
  )
})
