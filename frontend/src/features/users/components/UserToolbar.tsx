"use client";

import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { FilterDropdown, RefreshButton, SearchInput } from "@/shared/components/common";
import { Button, Select } from "@/shared/components/ui";
import type { RoleWithPermissions } from "@/shared/types";

interface FilterState {
  role: string;
  status: string;
}

interface UserToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  roles: RoleWithPermissions[];
  canCreate: boolean;
  isFetching: boolean;
  onAddUser: () => void;
  onRefresh: () => void;
}

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function UserToolbar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  roles,
  canCreate,
  isFetching,
  onAddUser,
  onRefresh,
}: UserToolbarProps) {
  const activeCount = (filters.role ? 1 : 0) + (filters.status ? 1 : 0);
  const clearAll = () => onFiltersChange({ role: "", status: "" });

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

      <FilterDropdown
        activeCount={activeCount}
        onClearAll={activeCount > 0 ? clearAll : undefined}
      >
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
        <FilterField label="Status">
          <Select
            value={filters.status}
            onChange={(v) => onFiltersChange({ ...filters, status: v })}
            options={statusOptions}
            placeholder="All statuses"
          />
        </FilterField>
      </FilterDropdown>

      <div className="flex-1" />

      <RefreshButton isLoading={isFetching} onClick={onRefresh} />

      {canCreate && (
        <Button size="sm" className="gap-1.5" onClick={onAddUser}>
          <Plus size={14} />
          Add user
        </Button>
      )}
    </div>
  );
}

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
