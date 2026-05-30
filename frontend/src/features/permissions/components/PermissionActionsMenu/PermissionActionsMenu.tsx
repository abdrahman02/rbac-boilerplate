"use client";

import { Copy, Pencil, Trash2 } from "lucide-react";
import { ActionsMenu, MenuItem } from "@/shared/components/common";

interface PermissionActionsMenuProps {
  onEdit: () => void;
  onCopyId: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function PermissionActionsMenu({ onEdit, onCopyId, onDelete, canEdit, canDelete }: PermissionActionsMenuProps) {
  return (
    <ActionsMenu>
      {canEdit && (
        <MenuItem icon={<Pencil size={14} />} onClick={onEdit}>
          Edit permission
        </MenuItem>
      )}
      <MenuItem icon={<Copy size={14} />} onClick={onCopyId}>
        Copy permission ID
      </MenuItem>
      {canDelete && (
        <>
          <div className="my-1 h-px bg-border" />
          <MenuItem icon={<Trash2 size={14} />} onClick={onDelete} destructive>
            Delete permission
          </MenuItem>
        </>
      )}
    </ActionsMenu>
  );
}
