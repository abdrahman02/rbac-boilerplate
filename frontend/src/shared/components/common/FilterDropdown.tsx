"use client";

import { ChevronDown, Filter } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { tv } from "tailwind-variants";

const filterTrigger = tv({
  base: "h-[38px] px-3.5 flex items-center gap-2 rounded-lg text-sm font-medium border transition-colors",
  variants: {
    active: {
      true: "bg-accent text-accent-foreground border-accent-foreground/25",
      false: "bg-background text-foreground border-input hover:bg-muted",
    },
    open: {
      true: "ring-2 ring-ring/20 border-ring",
    },
  },
  defaultVariants: { active: false },
});

interface FilterDropdownProps {
  activeCount?: number;
  onClearAll?: () => void;
  children: ReactNode;
}

export function FilterDropdown({ activeCount = 0, onClearAll, children }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={filterTrigger({ active: activeCount > 0, open })}
      >
        <Filter size={14} />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-[11px] font-semibold">
            {activeCount}
          </span>
        )}
        <ChevronDown
          size={13}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            role="presentation"
          />
          <div className="absolute top-[calc(100%+6px)] right-0 w-72 bg-popover border border-border rounded-xl shadow-lg z-50 animate-scale-in">
            <div className="flex items-center justify-between px-3.5 py-3 border-b border-border">
              <span className="text-[13px] font-semibold">Filters</span>
              {activeCount > 0 && onClearAll && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-[12.5px] text-primary font-medium hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="p-3.5 flex flex-col gap-3.5">{children}</div>
          </div>
        </>
      )}
    </div>
  );
}
