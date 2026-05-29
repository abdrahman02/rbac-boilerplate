"use client";

import { Copy, Pencil, Shield, Trash2, UserCheck, UserX } from "lucide-react";
import { ActionsMenu, MenuItem } from "@/shared/components/common";

interface UserActionsMenuProps {
  isActive: boolean;
  onEdit: () => void;
  onManageRoles: () => void;
  onCopyId: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function UserActionsMenu({
  isActive,
  onEdit,
  onManageRoles,
  onCopyId,
  onToggleStatus,
  onDelete,
  canEdit,
  canDelete,
}: UserActionsMenuProps) {
  return (
    <ActionsMenu>
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
      {canEdit && (
        <MenuItem
          icon={isActive ? <UserX size={14} /> : <UserCheck size={14} />}
          onClick={onToggleStatus}
        >
          {isActive ? "Deactivate" : "Activate"}
        </MenuItem>
      )}
      {canDelete && (
        <>
          <div className="my-1 h-px bg-border" />
          <MenuItem icon={<Trash2 size={14} />} onClick={onDelete} destructive>
            Delete user
          </MenuItem>
        </>
      )}
    </ActionsMenu>
  );
}
