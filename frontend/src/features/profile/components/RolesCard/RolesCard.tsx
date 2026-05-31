"use client";

import { ShieldCheck } from "lucide-react";
import { memo } from "react";
import { Badge } from "@/shared/components/ui";

interface RolesCardProps {
  roles: string[];
}

export const RolesCard = memo(function RolesCard({ roles }: RolesCardProps) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Roles</h3>
        <span className="text-xs text-muted-foreground">{roles.length} assigned</span>
      </div>

      {roles.length === 0 ? (
        <EmptyRoles />
      ) : (
        <ul className="flex flex-col gap-2">
          {roles.map((role) => (
            <RoleRow key={role} name={role} />
          ))}
        </ul>
      )}
    </div>
  );
});

const RoleRow = memo(function RoleRow({ name }: { name: string }) {
  return (
    <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border">
      <span className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <ShieldCheck size={14} />
      </span>
      <span className="flex-1 text-sm font-medium truncate">{name}</span>
      <Badge variant="primary">Active</Badge>
    </li>
  );
});

function EmptyRoles() {
  return (
    <div className="flex flex-col items-center gap-1.5 py-6 text-center">
      <ShieldCheck size={20} className="text-muted-foreground/50" />
      <p className="text-sm font-medium text-muted-foreground">No roles assigned</p>
      <p className="text-xs text-muted-foreground/70">Ask an admin to assign you a role.</p>
    </div>
  );
}
