import type { RoleWithPermissions, UserWithRoles } from '@/shared/types'

interface RoleDistributionProps {
  roles: RoleWithPermissions[]
  users: UserWithRoles[]
  isLoading?: boolean
}

export function RoleDistribution({ roles, users, isLoading }: RoleDistributionProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 bg-muted rounded animate-pulse w-24" />
            <div className="h-1.5 bg-muted rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  const displayRoles = roles.slice(0, 6)

  return (
    <div className="flex flex-col gap-2.5">
      {displayRoles.map((role) => {
        const count = users.filter((u) => u.roles.includes(role.name)).length
        const pct = users.length > 0 ? Math.round((count / users.length) * 100) : 0

        return (
          <div key={role.id}>
            <div className="flex justify-between text-[13px] mb-1">
              <span className="font-medium">{role.name}</span>
              <span className="text-muted-foreground font-mono text-xs">
                {count} · {pct}%
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
