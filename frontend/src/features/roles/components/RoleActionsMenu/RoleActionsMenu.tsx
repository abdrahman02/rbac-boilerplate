"use client";

import { Copy, Key, Pencil, Trash2 } from "lucide-react";
import { ActionsMenu, MenuItem } from "@/shared/components/common";

interface RoleActionsMenuProps {
  onEdit: () => void;
  onManagePermissions: () => void;
  onCopyId: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function RoleActionsMenu({
  onEdit,
  onManagePermissions,
  onCopyId,
  onDelete,
  canEdit,
  canDelete,
}: RoleActionsMenuProps) {
  return (
    <ActionsMenu>
      {canEdit && (
        <MenuItem icon={<Pencil size={14} />} onClick={onEdit}>
          Edit role
        </MenuItem>
      )}
      <MenuItem icon={<Key size={14} />} onClick={onManagePermissions}>
        Manage permissions
      </MenuItem>
      <MenuItem icon={<Copy size={14} />} onClick={onCopyId}>
        Copy role ID
      </MenuItem>
      {canDelete && (
        <>
          <div className="my-1 h-px bg-border" />
          <MenuItem icon={<Trash2 size={14} />} onClick={onDelete} destructive>
            Delete role
          </MenuItem>
        </>
      )}
    </ActionsMenu>
  );
}
