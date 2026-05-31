"use client";

import { Download, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { memo } from "react";
import { FilterDropdown, RefreshButton, SearchInput } from "@/shared/components/common";
import { Button, Select, Spinner } from "@/shared/components/ui";
import type { RoleWithPermissions } from "@/shared/types";
import type { FilterState } from "../../types";
import { STATUS_OPTIONS } from "./UserToolbar.constants";

interface UserToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  activeFilterCount: number;
  onClearFilters?: () => void;
  roles: RoleWithPermissions[];
  canCreate: boolean;
  isFetching: boolean;
  onAddUser: () => void;
  onRefresh: () => void;
  isExporting: boolean;
  onExport: () => void;
}

export const UserToolbar = memo(function UserToolbar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  activeFilterCount,
  onClearFilters,
  roles,
  canCreate,
  isFetching,
  onAddUser,
  onRefresh,
  isExporting,
  onExport,
}: UserToolbarProps) {
  return (
    <div className="flex gap-2.5 flex-wrap items-center p-3.5 rounded-xl border border-border bg-card shadow-sm">
      <div className="flex-1 min-w-[200px]">
        <SearchInput
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={search ? () => onSearchChange("") : undefined}
        />
      </div>

      <FilterDropdown activeCount={activeFilterCount} onClearAll={onClearFilters}>
        {roles.length > 0 && (
          <FilterField label="Role">
            <Select
              searchable
              value={filters.role}
              onChange={(v) => onFiltersChange({ ...filters, role: v })}
              options={roles.map((r) => ({ value: r.name, label: r.name }))}
              placeholder="All roles"
              searchPlaceholder="Search roles…"
            />
          </FilterField>
        )}
        <FilterField label="Status">
          <Select
            value={filters.status}
            onChange={(v) => onFiltersChange({ ...filters, status: v })}
            options={STATUS_OPTIONS}
            placeholder="All statuses"
          />
        </FilterField>
      </FilterDropdown>

      <div className="flex-1" />

      <RefreshButton isLoading={isFetching} onClick={onRefresh} />

      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={onExport}
        disabled={isExporting}
      >
        {isExporting ? <Spinner size="sm" /> : <Download size={14} />}
        Export
      </Button>

      {canCreate && (
        <Button size="sm" className="gap-1.5" onClick={onAddUser}>
          <Plus size={14} />
          Add user
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
