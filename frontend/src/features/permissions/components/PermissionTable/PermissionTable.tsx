"use client";

import { Key } from "lucide-react";
import { memo } from "react";
import {
  Badge,
  TableCell,
  TableEmptyRow,
  TableHeader,
  TableLoadingRow,
  TableRow,
  TableShell,
} from "@/shared/components/ui";
import type { Permission } from "@/shared/types";
import { PermissionActionsMenu } from "../PermissionActionsMenu";

interface PermissionTableProps {
  permissions: Permission[];
  isFetching: boolean;
  isError?: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
  onCopyPermissionId: (id: number) => void;
}

export const PermissionTable = memo(function PermissionTable({
  permissions,
  isFetching,
  isError,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  onCopyPermissionId,
}: PermissionTableProps) {
  return (
    <TableShell>
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="w-12 px-4 py-2.5 border-b border-border" />
            <TableHeader>Permission</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Used by</TableHeader>
            <TableHeader>Created</TableHeader>
          </tr>
        </thead>
        <tbody>
          <TableLoadingRow isLoading={isFetching} colSpan={5} />
          {isError && !isFetching && (
            <tr>
              <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                Failed to load permissions. Try refreshing.
              </td>
            </tr>
          )}
          <TableEmptyRow
            isEmpty={!isFetching && !isError && permissions.length === 0}
            colSpan={5}
            icon={<Key size={24} strokeWidth={1.5} aria-hidden />}
            title="No permissions match your filters"
            description="Try clearing the search or filters to see all permissions."
          />
          {permissions.map((permission) => (
            <PermissionRow
              key={permission.id}
              permission={permission}
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={onEdit}
              onDelete={onDelete}
              onCopyPermissionId={onCopyPermissionId}
            />
          ))}
        </tbody>
      </table>
    </TableShell>
  );
});

interface PermissionRowProps {
  permission: Permission;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
  onCopyPermissionId: (id: number) => void;
}

const PermissionRow = memo(function PermissionRow({
  permission,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  onCopyPermissionId,
}: PermissionRowProps) {
  return (
    <TableRow>
      <TableCell className="w-12">
        <PermissionActionsMenu
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={() => onEdit(permission)}
          onCopyId={() => onCopyPermissionId(permission.id)}
          onDelete={() => onDelete(permission)}
        />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 flex items-center justify-center rounded-lg border border-border shrink-0 bg-muted text-muted-foreground">
            <Key size={14} />
          </span>
          <span className="font-semibold font-mono text-[13px]">{permission.name}</span>
        </div>
      </TableCell>

      <TableCell className="text-[13px] text-muted-foreground max-w-[240px]">
        {permission.description ?? <span className="text-[12px]">—</span>}
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-1">
          {permission.roles.length === 0 ? (
            <Badge variant="default">Unused</Badge>
          ) : (
            <>
              {permission.roles.slice(0, 3).map((roleName) => (
                <Badge key={roleName} variant="default">
                  {roleName}
                </Badge>
              ))}
              {permission.roles.length > 3 && <Badge variant="info">+{permission.roles.length - 3}</Badge>}
            </>
          )}
        </div>
      </TableCell>

      <TableCell className="text-[13px] text-muted-foreground">
        {new Date(permission.createdAt).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
});
