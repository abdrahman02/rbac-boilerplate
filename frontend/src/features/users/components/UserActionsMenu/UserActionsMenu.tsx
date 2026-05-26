"use client";

import { Copy, Pencil, Shield, Trash2 } from "lucide-react";
import { ActionsMenu, MenuItem } from "@/shared/components/common";

interface UserActionsMenuProps {
  onEdit: () => void;
  onManageRoles: () => void;
  onCopyId: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function UserActionsMenu({
  onEdit,
  onManageRoles,
  onCopyId,
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
