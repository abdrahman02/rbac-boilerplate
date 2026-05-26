import { memo } from "react";
import { useRoleDistribution } from "./useRoleDistribution";

// RoleDistribution fetches its own data because the /api/dashboard/stats endpoint
// returns aggregate counts, not the full roles/users arrays needed for bar percentages.
export const RoleDistribution = memo(function RoleDistribution() {
  const { isLoading, isError, roleBars } = useRoleDistribution();

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
