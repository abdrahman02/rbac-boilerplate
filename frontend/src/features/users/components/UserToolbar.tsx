"use client";

import { ChevronDown, Filter, Plus, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import type { RoleWithPermissions } from "@/shared/types";
import { Button, Input } from "@/shared/components/ui";

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
  onAddUser: () => void;
}

export function UserToolbar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  roles,
  canCreate,
  onAddUser,
}: UserToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const activeCount = (filters.role ? 1 : 0) + (filters.status ? 1 : 0);
  const clearAll = () => onFiltersChange({ role: "", status: "" });

  return (
    <div className="flex gap-2.5 flex-wrap items-center p-3.5 rounded-xl border border-border bg-card shadow-sm">
      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          iconLeft={<Search size={15} />}
        />
      </div>

      {/* Filter dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setFilterOpen((o) => !o)}
          className={`h-[38px] px-3.5 flex items-center gap-2 rounded-lg text-sm font-medium border transition-colors ${
            activeCount > 0
              ? "bg-accent text-accent-foreground border-accent-foreground/25"
              : "bg-background text-foreground border-input hover:bg-muted"
          } ${filterOpen ? "ring-2 ring-ring/20 border-ring" : ""}`}
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
            className={`text-muted-foreground transition-transform ${filterOpen ? "rotate-180" : ""}`}
          />
        </button>

        {filterOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setFilterOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setFilterOpen(false)}
              role="presentation"
            />
            <div className="absolute top-[calc(100%+6px)] right-0 w-72 bg-popover border border-border rounded-xl shadow-lg z-50 animate-scale-in">
              <div className="flex items-center justify-between px-3.5 py-3 border-b border-border">
                <span className="text-[13px] font-semibold">Filters</span>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[12.5px] text-primary font-medium hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="p-3.5 flex flex-col gap-3.5">
                <FilterField label="Role">
                  <select
                    value={filters.role}
                    onChange={(e) => onFiltersChange({ ...filters, role: e.target.value })}
                    className="w-full h-9 pl-3 pr-8 rounded-lg border border-input bg-background text-sm appearance-none text-foreground cursor-pointer"
                  >
                    <option value="">All roles</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </FilterField>
                <FilterField label="Status">
                  <select
                    value={filters.status}
                    onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                    className="w-full h-9 pl-3 pr-8 rounded-lg border border-input bg-background text-sm appearance-none text-foreground cursor-pointer"
                  >
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </FilterField>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Clear search */}
      {search && (
        <Button variant="ghost" size="sm" onClick={() => onSearchChange("")} className="gap-1.5">
          <X size={14} />
          Clear
        </Button>
      )}

      <div className="flex-1" />

      {/* Add user button (permission-gated via canCreate prop) */}
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
