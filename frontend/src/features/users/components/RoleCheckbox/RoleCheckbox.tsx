import { Shield } from "lucide-react";
import { Badge, Checkbox } from "@/shared/components/ui";
import type { RoleWithPermissions } from "@/shared/types";
import { roleLabel } from "./RoleCheckbox.variants";

interface RoleCheckboxProps {
  role: RoleWithPermissions;
  checked: boolean;
  adding: boolean;
  removing: boolean;
  onToggle: () => void;
}

export function RoleCheckbox({ role, checked, adding, removing, onToggle }: RoleCheckboxProps) {
  return (
    <label htmlFor={`role-${role.id}`} className={roleLabel({ checked })}>
      <Checkbox id={`role-${role.id}`} checked={checked} onChange={onToggle} />
      <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
        <Shield size={14} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold">{role.name}</div>
        <div className="text-[12px] text-muted-foreground">
          {role.permissions.length} permission{role.permissions.length === 1 ? "" : "s"}
        </div>
      </div>
      {adding && <Badge variant="success">Adding</Badge>}
      {removing && <Badge variant="danger">Removing</Badge>}
    </label>
  );
}
