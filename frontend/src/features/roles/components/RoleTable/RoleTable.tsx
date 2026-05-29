"use client";

import { Shield, ShieldOff } from "lucide-react";
import { memo } from "react";
import {
  Avatar,
  Badge,
  TableCell,
  TableEmptyRow,
  TableHeader,
  TableLoadingRow,
  TableRow,
  TableShell,
} from "@/shared/components/ui";
import type { RoleWithPermissions, UserWithRoles } from "@/shared/types";
import { RoleActionsMenu } from "../RoleActionsMenu";

interface RoleTableProps {
  roles: RoleWithPermissions[];
  isFetching: boolean;
  isError?: boolean;
  canEdit: boolean;
  canDelete: boolean;
  roleUserMap: Record<string, UserWithRoles[]>;
  onEdit: (role: RoleWithPermissions) => void;
  onManagePermissions: (role: RoleWithPermissions) => void;
  onDelete: (role: RoleWithPermissions) => void;
  onCopyRoleId: (roleId: number) => void;
}

export const RoleTable = memo(function RoleTable({
  roles,
  isFetching,
  isError,
  canEdit,
  canDelete,
  roleUserMap,
  onEdit,
  onManagePermissions,
  onDelete,
  onCopyRoleId,
}: RoleTableProps) {
  return (
    <TableShell>
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="w-12 px-4 py-2.5 border-b border-border" />
            <TableHeader>Role</TableHeader>
            <TableHeader>Permissions</TableHeader>
            <TableHeader>Users</TableHeader>
            <TableHeader>Created</TableHeader>
          </tr>
        </thead>
        <tbody>
          <TableLoadingRow isLoading={isFetching} colSpan={5} />
          {isError && !isFetching && (
            <tr>
              <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                Failed to load roles. Try refreshing.
              </td>
            </tr>
          )}
          <TableEmptyRow
            isEmpty={!isFetching && !isError && roles.length === 0}
            colSpan={5}
            icon={<ShieldOff size={24} strokeWidth={1.5} aria-hidden />}
            title="No roles match your filters"
            description="Try clearing the search or filters to see all roles."
          />
          {roles.map((role) => (
            <RoleRow
              key={role.id}
              role={role}
              canEdit={canEdit}
              canDelete={canDelete}
              users={roleUserMap[role.name] ?? []}
              onEdit={onEdit}
              onManagePermissions={onManagePermissions}
              onDelete={onDelete}
              onCopyRoleId={onCopyRoleId}
            />
          ))}
        </tbody>
      </table>
    </TableShell>
  );
});

interface RoleRowProps {
  role: RoleWithPermissions;
  canEdit: boolean;
  canDelete: boolean;
  users: UserWithRoles[];
  onEdit: (role: RoleWithPermissions) => void;
  onManagePermissions: (role: RoleWithPermissions) => void;
  onDelete: (role: RoleWithPermissions) => void;
  onCopyRoleId: (roleId: number) => void;
}

const RoleRow = memo(function RoleRow({
  role,
  canEdit,
  canDelete,
  users,
  onEdit,
  onManagePermissions,
  onDelete,
  onCopyRoleId,
}: RoleRowProps) {
  return (
    <TableRow>
      <TableCell className="w-12">
        <RoleActionsMenu
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={() => onEdit(role)}
          onManagePermissions={() => onManagePermissions(role)}
          onCopyId={() => onCopyRoleId(role.id)}
          onDelete={() => onDelete(role)}
        />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 flex items-center justify-center rounded-[10px] border border-border shrink-0 bg-muted text-muted-foreground">
            <Shield size={17} />
          </span>
          <div>
            <div className="font-semibold text-[13.5px]">{role.name}</div>
            <div className="text-[12px] text-muted-foreground font-mono">#{role.id}</div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[13.5px] font-semibold tabular-nums">{role.permissions.length}</span>
          <span className="text-[12px] text-muted-foreground">
            permission{role.permissions.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 max-w-[360px]">
          {role.permissions.slice(0, 4).map((p) => (
            <Badge key={p} variant="default">
              {p}
            </Badge>
          ))}
          {role.permissions.length > 4 && <Badge variant="info">+{role.permissions.length - 4}</Badge>}
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <AvatarStack users={users} max={3} />
          <span className="text-[13px] text-muted-foreground tabular-nums">{users.length}</span>
        </div>
      </TableCell>

      <TableCell className="text-[13px] text-muted-foreground">
        {new Date(role.created_at).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
});

function AvatarStack({ users, max = 3 }: { users: UserWithRoles[]; max?: number }) {
  const visible = users.slice(0, max);
  const overflow = Math.max(0, users.length - max);

  if (users.length === 0) return null;

  return (
    <div className="flex items-center">
      {visible.map((u, i) => (
        <span
          key={u.id}
          className="rounded-full ring-2 ring-card"
          style={{ marginLeft: i === 0 ? 0 : -8, position: "relative", zIndex: 10 - i }}
        >
          <Avatar name={u.name} size={24} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground border border-border text-[10.5px] font-semibold ring-2 ring-card tabular-nums"
          style={{ marginLeft: -8, width: 24, height: 24 }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
