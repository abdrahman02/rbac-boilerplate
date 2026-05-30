"use client";

import type { ReactNode } from "react";
import { memo } from "react";
import { FilterDropdown, RefreshButton, SearchInput } from "@/shared/components/common";
import { Select } from "@/shared/components/ui";
import type { AuditLogFiltersState } from "../../types";
import { ACTION_OPTIONS, RESOURCE_TYPE_OPTIONS } from "./AuditLogToolbar.constants";

interface AuditLogToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filters: AuditLogFiltersState;
  onFiltersChange: (f: AuditLogFiltersState) => void;
  activeFilterCount: number;
  onClearFilters?: () => void;
  isFetching: boolean;
  onRefresh: () => void;
}

export const AuditLogToolbar = memo(function AuditLogToolbar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  activeFilterCount,
  onClearFilters,
  isFetching,
  onRefresh,
}: AuditLogToolbarProps) {
  return (
    <div className="flex gap-2.5 flex-wrap items-center p-3.5 rounded-xl border border-border bg-card shadow-sm">
      <div className="flex-1 min-w-[200px]">
        <SearchInput
          placeholder="Search by action or resource type"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={search ? () => onSearchChange("") : undefined}
        />
      </div>

      <FilterDropdown activeCount={activeFilterCount} onClearAll={onClearFilters}>
        <FilterField label="Action">
          <Select
            searchable
            value={filters.action}
            onChange={(v) => onFiltersChange({ ...filters, action: v })}
            options={ACTION_OPTIONS}
            placeholder="All actions"
            searchPlaceholder="Search actions…"
          />
        </FilterField>
        <FilterField label="Resource type">
          <Select
            value={filters.resourceType}
            onChange={(v) => onFiltersChange({ ...filters, resourceType: v })}
            options={RESOURCE_TYPE_OPTIONS}
            placeholder="All resource types"
          />
        </FilterField>
      </FilterDropdown>

      <div className="flex-1" />

      <RefreshButton isLoading={isFetching} onClick={onRefresh} />
    </div>
  );
});

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}
