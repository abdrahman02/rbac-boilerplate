"use client";

import { Copy, Pencil, Shield, Trash2 } from "lucide-react";
import { DropdownMenuItem, RowActionsDropdown } from "@/shared/components/common";

interface UserRowMenuProps {
  onEdit: () => void;
  onManageRoles: () => void;
  onCopyId: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function UserRowMenu({
  onEdit,
  onManageRoles,
  onCopyId,
  onDelete,
  canEdit,
  canDelete,
}: UserRowMenuProps) {
  return (
    <RowActionsDropdown>
      {canEdit && (
        <DropdownMenuItem icon={<Pencil size={14} />} onClick={onEdit}>
          Edit user
        </DropdownMenuItem>
      )}
      <DropdownMenuItem icon={<Shield size={14} />} onClick={onManageRoles}>
        Manage roles
      </DropdownMenuItem>
      <DropdownMenuItem icon={<Copy size={14} />} onClick={onCopyId}>
        Copy user ID
      </DropdownMenuItem>
      {canDelete && (
        <>
          <div className="my-1 h-px bg-border" />
          <DropdownMenuItem icon={<Trash2 size={14} />} onClick={onDelete} destructive>
            Delete user
          </DropdownMenuItem>
        </>
      )}
    </RowActionsDropdown>
  );
}
