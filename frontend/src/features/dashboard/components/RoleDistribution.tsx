import { memo, useMemo } from "react";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { useUsers } from "@/features/users/hooks";

const MAX_USERS_FOR_DISTRIBUTION = 200;

interface RoleBar {
  id: number;
  name: string;
  count: number;
  pct: number;
}

// RoleDistribution fetches its own data because the /api/dashboard/stats endpoint
// returns aggregate counts, not the full roles/users arrays needed for bar percentages.
export const RoleDistribution = memo(function RoleDistribution() {
  const rolesQuery = useRoles();
  const usersQuery = useUsers(1, MAX_USERS_FOR_DISTRIBUTION);

  const roles = rolesQuery.data ?? [];
  const users = usersQuery.data?.data ?? [];
  const isLoading = rolesQuery.isLoading || usersQuery.isLoading;
  const isError = rolesQuery.isError || usersQuery.isError;

  const roleBars = useMemo<RoleBar[]>(() => {
    const roleCountMap = users.reduce<Record<string, number>>((acc, u) => {
      for (const roleName of u.roles) {
        acc[roleName] = (acc[roleName] ?? 0) + 1;
      }
      return acc;
    }, {});

    return roles.slice(0, 6).map((role) => {
      const count = roleCountMap[role.name] ?? 0;
      const pct = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
      return { id: role.id, name: role.name, count, pct };
    });
  }, [roles, users]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static placeholders with no identity
          <div key={i} className="space-y-1.5">
            <div className="h-3 bg-muted rounded animate-pulse w-24" />
            <div className="h-1.5 bg-muted rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">Failed to load role distribution.</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {roleBars.map(({ id, name, count, pct }) => (
        <div key={id}>
          <div className="flex justify-between text-[13px] mb-1">
            <span className="font-medium">{name}</span>
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
      ))}
    </div>
  );
});
