import type { ReactNode } from "react";
import { tv } from "tailwind-variants";

const menuItemBase = tv({
  base: "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13.5px] transition-colors text-left cursor-pointer",
  variants: {
    destructive: {
      true: "text-destructive hover:bg-destructive/[.08]",
      false: "text-foreground hover:bg-accent",
    },
  },
  defaultVariants: { destructive: false },
});

const menuItemIcon = tv({
  base: "flex",
  variants: {
    destructive: {
      true: "text-destructive",
      false: "text-muted-foreground",
    },
  },
  defaultVariants: { destructive: false },
});

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
