import { Badge, Checkbox } from "@/shared/components/ui";
import type { Permission } from "@/shared/types";
import { permissionLabel } from "./PermissionCheckbox.variants";

interface PermissionCheckboxProps {
  permission: Permission;
  checked: boolean;
  adding: boolean;
  removing: boolean;
  onToggle: () => void;
}

export function PermissionCheckbox({ permission, checked, adding, removing, onToggle }: PermissionCheckboxProps) {
  return (
    <label htmlFor={`perm-${permission.id}`} className={permissionLabel({ checked })}>
      <Checkbox id={`perm-${permission.id}`} checked={checked} onChange={onToggle} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[13px] font-semibold">{permission.name}</span>
          {adding && <Badge variant="success">Adding</Badge>}
          {removing && <Badge variant="danger">Removing</Badge>}
        </div>
        {permission.description && (
          <div className="text-[12.5px] text-muted-foreground mt-0.5">{permission.description}</div>
        )}
      </div>
    </label>
  );
}
