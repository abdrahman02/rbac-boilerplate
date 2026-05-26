"use client";

import { ChevronDown, Filter } from "lucide-react";
import type { ReactNode } from "react";
import { Dropdown } from "@/shared/components/ui";
import { filterTrigger } from "./FilterDropdown.variants";

interface FilterDropdownProps {
  activeCount?: number;
  onClearAll?: () => void;
  children: ReactNode;
}

export function FilterDropdown({ activeCount = 0, onClearAll, children }: FilterDropdownProps) {
  const isActive = activeCount > 0;

  return (
    <Dropdown
      placement="bottom-end"
      trigger={(open) => (
        <button type="button" className={filterTrigger({ active: isActive, open })}>
          <Filter size={14} />
          <span>Filters</span>
          {isActive && (
            <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-[11px] font-semibold">
              {activeCount}
            </span>
          )}
          <ChevronDown size={13} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}
    >
      <div className="w-72 bg-popover border border-border rounded-xl shadow-lg animate-scale-in">
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-border">
          <span className="text-[13px] font-semibold">Filters</span>
          {isActive && onClearAll && (
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
    </Dropdown>
  );
}
