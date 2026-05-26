"use client";

import type { Placement } from "@floating-ui/react";
import { Ellipsis } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Dropdown } from "@/shared/components/ui";

interface ActionsMenuProps {
  children: ReactNode;
  placement?: Placement;
}

export function ActionsMenu({ children, placement = "bottom-start" }: ActionsMenuProps) {
  return (
    <Dropdown
      placement={placement}
      trigger={
        <Button
          variant="ghost"
          size="iconOnly"
          title="Actions"
          className="w-7 h-7 rounded-md text-muted-foreground hover:text-foreground"
        >
          <Ellipsis size={15} />
        </Button>
      }
    >
      <div className="min-w-[200px] p-1.5 bg-popover rounded-lg border border-border shadow-md animate-scale-in">
        {children}
      </div>
    </Dropdown>
  );
}
