"use client";

import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { memo } from "react";
import { FilterDropdown, RefreshButton, SearchInput } from "@/shared/components/common";
import { Button, Select } from "@/shared/components/ui";
import type { PermissionsFilterState } from "../../types";

const USAGE_OPTIONS = [
  { value: "used", label: "Used by 1+ role" },
  { value: "unused", label: "Unused" },
];

interface PermissionToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filters: PermissionsFilterState;
  onFiltersChange: (f: PermissionsFilterState) => void;
  activeFilterCount: number;
  onClearFilters?: () => void;
  canCreate: boolean;
  isFetching: boolean;
  onAddPermission: () => void;
  onRefresh: () => void;
}

export const PermissionToolbar = memo(function PermissionToolbar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  activeFilterCount,
  onClearFilters,
  canCreate,
  isFetching,
  onAddPermission,
  onRefresh,
}: PermissionToolbarProps) {
  return (
    <div className="flex gap-2.5 flex-wrap items-center p-3.5 rounded-xl border border-border bg-card shadow-sm">
      <div className="flex-1 min-w-[200px]">
        <SearchInput
          placeholder="Search permissions"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={search ? () => onSearchChange("") : undefined}
        />
      </div>

      <FilterDropdown activeCount={activeFilterCount} onClearAll={onClearFilters}>
        <FilterField label="Usage">
          <Select
            value={filters.usage}
            onChange={(v) => onFiltersChange({ ...filters, usage: v })}
            options={USAGE_OPTIONS}
            placeholder="All permissions"
          />
        </FilterField>
      </FilterDropdown>

      <div className="flex-1" />

      <RefreshButton isLoading={isFetching} onClick={onRefresh} />

      {canCreate && (
        <Button size="sm" className="gap-1.5" onClick={onAddPermission}>
          <Plus size={14} />
          Add permission
        </Button>
      )}
    </div>
  );
});

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
