"use client";

import { ChevronDown, Filter } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Dropdown } from "@/shared/components/ui";
import {
  filterBadge,
  filterChevron,
  filterClearBtn,
  filterPanel,
  filterPanelBody,
  filterPanelHeader,
  filterTrigger,
} from "./FilterDropdown.variants";

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
        <Button variant="outline" className={filterTrigger({ active: isActive, open })}>
          <Filter size={14} />
          <span>Filters</span>
          {isActive && <span className={filterBadge()}>{activeCount}</span>}
          <ChevronDown size={13} className={filterChevron({ open })} />
        </Button>
      )}
    >
      <div className={filterPanel()}>
        <div className={filterPanelHeader()}>
          <span className="text-[13px] font-semibold">Filters</span>
          {isActive && onClearAll && (
            <Button variant="ghost" onClick={onClearAll} className={filterClearBtn()}>
              Clear all
            </Button>
          )}
        </div>
        <div className={filterPanelBody()}>{children}</div>
      </div>
    </Dropdown>
  );
}
