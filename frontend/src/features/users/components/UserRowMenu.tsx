"use client";

import { Copy, Ellipsis, Pencil, Shield, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Dropdown } from "@/shared/components/ui";

interface UserRowMenuProps {
  onEdit: () => void;
  onManageRoles: () => void;
  onCopyId: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function UserRowMenu({ onEdit, onManageRoles, onCopyId, onDelete, canEdit, canDelete }: UserRowMenuProps) {
  return (
    <Dropdown
      placement="bottom-start"
      trigger={
        <button
          type="button"
          title="Row actions"
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Ellipsis size={15} />
        </button>
      }
    >
      <div className="min-w-[200px] p-1.5 bg-popover rounded-lg border border-border shadow-md animate-scale-in">
        {canEdit && (
          <MenuItem icon={<Pencil size={14} />} onClick={onEdit}>
            Edit user
          </MenuItem>
        )}
        <MenuItem icon={<Shield size={14} />} onClick={onManageRoles}>
          Manage roles
        </MenuItem>
        <MenuItem icon={<Copy size={14} />} onClick={onCopyId}>
          Copy user ID
        </MenuItem>
        {canDelete && (
          <>
            <div className="my-1 h-px bg-border" />
            <MenuItem icon={<Trash2 size={14} />} onClick={onDelete} destructive>
              Delete user
            </MenuItem>
          </>
        )}
      </div>
    </Dropdown>
  );
}

interface MenuItemProps {
  icon: ReactNode;
  onClick: () => void;
  children: ReactNode;
  destructive?: boolean;
}

function MenuItem({ icon, onClick, children, destructive }: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13.5px] transition-colors text-left cursor-pointer ${
        destructive
          ? "text-destructive hover:bg-destructive/[.08]"
          : "text-foreground hover:bg-accent"
      }`}
    >
      <span className={`flex ${destructive ? "text-destructive" : "text-muted-foreground"}`}>
        {icon}
      </span>
      {children}
    </button>
  );
}
