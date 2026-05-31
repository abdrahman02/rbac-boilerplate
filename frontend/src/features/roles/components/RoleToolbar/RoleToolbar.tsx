"use client";

import { Download, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { memo } from "react";
import { FilterDropdown, RefreshButton, SearchInput } from "@/shared/components/common";
import { Button, Select, Spinner } from "@/shared/components/ui";
import type { RolesFilterState } from "../../types";

interface RoleToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filters: RolesFilterState;
  onFiltersChange: (f: RolesFilterState) => void;
  activeFilterCount: number;
  onClearFilters?: () => void;
  filterPermissions: string[];
  canCreate: boolean;
  isFetching: boolean;
  onAddRole: () => void;
  onRefresh: () => void;
  isExporting: boolean;
  onExport: () => void;
}

export const RoleToolbar = memo(function RoleToolbar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  activeFilterCount,
  onClearFilters,
  filterPermissions,
  canCreate,
  isFetching,
  onAddRole,
  onRefresh,
  isExporting,
  onExport,
}: RoleToolbarProps) {
  return (
    <div className="flex gap-2.5 flex-wrap items-center p-3.5 rounded-xl border border-border bg-card shadow-sm">
      <div className="flex-1 min-w-[200px]">
        <SearchInput
          placeholder="Search roles"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={search ? () => onSearchChange("") : undefined}
        />
      </div>

      {filterPermissions.length > 0 && (
        <FilterDropdown activeCount={activeFilterCount} onClearAll={onClearFilters}>
          <FilterField label="Permission">
            <Select
              searchable
              value={filters.permission}
              onChange={(v) => onFiltersChange({ ...filters, permission: v })}
              options={filterPermissions.map((p) => ({ value: p, label: p }))}
              placeholder="Any permission"
              searchPlaceholder="Search permissions…"
            />
          </FilterField>
        </FilterDropdown>
      )}

      <div className="flex-1" />

      <RefreshButton isLoading={isFetching} onClick={onRefresh} />

      <Button variant="outline" size="sm" className="gap-1.5" onClick={onExport} disabled={isExporting}>
        {isExporting ? <Spinner size="sm" /> : <Download size={14} />}
        Export
      </Button>

      {canCreate && (
        <Button size="sm" className="gap-1.5" onClick={onAddRole}>
          <Plus size={14} />
          Add role
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
