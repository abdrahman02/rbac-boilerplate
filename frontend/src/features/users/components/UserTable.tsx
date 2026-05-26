"use client";

import { Plus, Users, X } from "lucide-react";
import type { ReactNode } from "react";
import {
  Avatar,
  TableCell,
  TableEmptyRow,
  TableHeader,
  TableLoadingRow,
  TableRow,
  TableShell,
} from "@/shared/components/ui";
import type { UserWithRoles } from "@/shared/types";
import { StatusBadge } from "./StatusBadge";
import { UserRowMenu } from "./UserRowMenu";

interface UserTableProps {
  users: UserWithRoles[];
  isFetching: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (user: UserWithRoles) => void;
  onManageRoles: (user: UserWithRoles) => void;
  onDelete: (user: UserWithRoles) => void;
  onRemoveRole: (user: UserWithRoles, roleName: string) => void;
}

export function UserTable({
  users,
  isFetching,
  canEdit,
  canDelete,
  onEdit,
  onManageRoles,
  onDelete,
  onRemoveRole,
}: UserTableProps) {
  return (
    <TableShell>
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="w-12 px-4 py-2.5 border-b border-border" />
            <TableHeader>User</TableHeader>
            <TableHeader>Roles</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Created</TableHeader>
          </tr>
        </thead>
        <tbody>
          <TableLoadingRow isLoading={isFetching} colSpan={5} />
          <TableEmptyRow
            isEmpty={!isFetching && users.length === 0}
            colSpan={5}
            icon={<Users size={24} strokeWidth={1.5} aria-hidden />}
            title="No users match your filters"
            description="Try clearing the search or filters to see all users."
          />
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={() => onEdit(user)}
              onManageRoles={() => onManageRoles(user)}
              onDelete={() => onDelete(user)}
              onRemoveRole={(roleName) => onRemoveRole(user, roleName)}
            />
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

interface UserRowProps {
  user: UserWithRoles;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onManageRoles: () => void;
  onDelete: () => void;
  onRemoveRole: (roleName: string) => void;
}

function UserRow({
  user,
  canEdit,
  canDelete,
  onEdit,
  onManageRoles,
  onDelete,
  onRemoveRole,
}: UserRowProps) {
  const handleCopyId = () => {
    navigator.clipboard.writeText(String(user.id)).catch(() => {});
  };

  return (
    <TableRow>
      <TableCell className="w-12">
        <UserRowMenu
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={onEdit}
          onManageRoles={onManageRoles}
          onCopyId={handleCopyId}
          onDelete={onDelete}
        />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2.5">
          <Avatar name={user.name} size={32} />
          <div>
            <div className="font-semibold text-[13.5px]">{user.name}</div>
            <div className="text-[12.5px] text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-1 items-center">
          {user.roles.length === 0 ? (
            <span className="text-[12px] text-muted-foreground">No role</span>
          ) : (
            user.roles.map((role) => (
              <RemovableBadge key={role} onRemove={() => onRemoveRole(role)}>
                {role}
              </RemovableBadge>
            ))
          )}
          <button
            type="button"
            onClick={onManageRoles}
            title="Manage roles"
            className="h-[22px] px-2 inline-flex items-center gap-1 rounded-full border border-dashed border-border text-[11.5px] text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            <Plus size={11} />
            Add
          </button>
        </div>
      </TableCell>

      <TableCell>
        <StatusBadge isActive={user.is_active} />
      </TableCell>

      <TableCell className="text-[13px] text-muted-foreground">
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
}

function RemovableBadge({ children, onRemove }: { children: ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 h-[22px] pl-2 pr-1 bg-secondary text-secondary-foreground border border-border rounded-full text-[12px] font-medium whitespace-nowrap">
      {children}
      <button
        type="button"
        onClick={onRemove}
        title="Remove role"
        className="w-4 h-4 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors"
      >
        <X size={10} />
      </button>
    </span>
  );
}
