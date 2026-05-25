"use client";

import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, Spinner } from "@/shared/components/ui";
import type { UserWithRoles } from "@/shared/types";
import { StatusBadge } from "./StatusBadge";
import { UserRowMenu } from "./UserRowMenu";

interface UserTableProps {
  users: UserWithRoles[];
  isLoading: boolean;
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
  isLoading,
  isFetching,
  canEdit,
  canDelete,
  onEdit,
  onManageRoles,
  onDelete,
  onRemoveRole,
}: UserTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
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
          {isLoading ? (
            <LoadingRow />
          ) : (
            <>
              {isFetching && <LoadingRow />}
              {users.length === 0 ? (
                <EmptyRow />
              ) : (
                users.map((user) => (
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
                ))
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.02em] border-b border-border whitespace-nowrap">
      {children}
    </th>
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

function UserRow({ user, canEdit, canDelete, onEdit, onManageRoles, onDelete, onRemoveRole }: UserRowProps) {
  const handleCopyId = () => {
    navigator.clipboard.writeText(String(user.id)).catch(() => {});
  };

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      {/* Row menu */}
      <td className="px-4 py-3 w-12">
        <UserRowMenu
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={onEdit}
          onManageRoles={onManageRoles}
          onCopyId={handleCopyId}
          onDelete={onDelete}
        />
      </td>

      {/* User identity */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={user.name} size={32} />
          <div>
            <div className="font-semibold text-[13.5px]">{user.name}</div>
            <div className="text-[12.5px] text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </td>

      {/* Roles with inline remove + add */}
      <td className="px-4 py-3">
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
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge isActive={user.is_active} />
      </td>

      {/* Created date */}
      <td className="px-4 py-3 text-[13px] text-muted-foreground">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
    </tr>
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
        className="w-4 h-4 flex items-center justify-center rounded-full text-[10px] leading-none text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors"
      >
        ✕
      </button>
    </span>
  );
}

function LoadingRow() {
  return (
    <tr>
      <td colSpan={5} className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
          <Spinner size="sm" />
          <span>Fetching latest data…</span>
        </div>
      </td>
    </tr>
  );
}

function EmptyRow() {
  return (
    <tr>
      <td colSpan={5}>
        <div className="flex flex-col items-center gap-3 py-16 px-4 text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground">
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="text-[15px] font-semibold">No users match your filters</div>
          <div className="text-[13.5px] text-muted-foreground max-w-sm">
            Try clearing the search or filters to see all users.
          </div>
        </div>
      </td>
    </tr>
  );
}
