import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui";
import { menuItemBase, menuItemIcon } from "./MenuItem.variants";

interface MenuItemProps {
  icon?: ReactNode;
  onClick: () => void;
  destructive?: boolean;
  children: ReactNode;
}

export function MenuItem({ icon, onClick, destructive = false, children }: MenuItemProps) {
  return (
    <Button variant="ghost" onClick={onClick} className={menuItemBase({ destructive })}>
      {icon && <span className={menuItemIcon({ destructive })}>{icon}</span>}
      {children}
    </Button>
  );
}
