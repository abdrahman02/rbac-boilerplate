"use client";

import { KeyRound } from "lucide-react";
import { memo } from "react";

interface PermissionsCardProps {
  permissions: string[];
}

export const PermissionsCard = memo(function PermissionsCard({ permissions }: PermissionsCardProps) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Effective Permissions</h3>
        <span className="text-xs text-muted-foreground">{permissions.length} total</span>
      </div>

      {permissions.length === 0 ? (
        <EmptyPermissions />
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {permissions.map((permission) => (
            <PermissionPill key={permission} name={permission} />
          ))}
        </div>
      )}
    </div>
  );
});

const PermissionPill = memo(function PermissionPill({ name }: { name: string }) {
  return (
    <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-muted border border-border text-foreground">
      {name}
    </span>
  );
});

function EmptyPermissions() {
  return (
    <div className="flex flex-col items-center gap-1.5 py-6 text-center">
      <KeyRound size={20} className="text-muted-foreground/50" />
      <p className="text-sm font-medium text-muted-foreground">No permissions yet</p>
    </div>
  );
}
