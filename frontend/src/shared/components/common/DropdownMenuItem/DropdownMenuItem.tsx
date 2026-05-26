import type { ReactNode } from "react";
import { menuItemBase, menuItemIcon } from "./DropdownMenuItem.variants";

interface DropdownMenuItemProps {
  icon?: ReactNode;
  onClick: () => void;
  destructive?: boolean;
  children: ReactNode;
}

export function DropdownMenuItem({
  icon,
  onClick,
  destructive = false,
  children,
}: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={menuItemBase({ destructive })}
    >
      {icon && <span className={menuItemIcon({ destructive })}>{icon}</span>}
      {children}
    </button>
  );
}
