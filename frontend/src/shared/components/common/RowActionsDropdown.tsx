"use client";

import type { Placement } from "@floating-ui/react";
import { Ellipsis } from "lucide-react";
import type { ReactNode } from "react";
import { Dropdown } from "@/shared/components/ui/Dropdown";

interface RowActionsDropdownProps {
  children: ReactNode;
  placement?: Placement;
}

export function RowActionsDropdown({ children, placement = "bottom-start" }: RowActionsDropdownProps) {
  return (
    <Dropdown
      placement={placement}
      trigger={
        <button
          type="button"
          title="Row actions"
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Ellipsis size={15} />
        </button>
      }
    >
      <div className="min-w-[200px] p-1.5 bg-popover rounded-lg border border-border shadow-md animate-scale-in">
        {children}
      </div>
    </Dropdown>
  );
}
