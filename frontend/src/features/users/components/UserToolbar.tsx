"use client";

import { Check, ChevronDown, Filter, Loader2, Plus, RefreshCw, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
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
  isFetching: boolean;
  onAddUser: () => void;
  onRefresh: () => void;
}

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
                  <SearchableSelect
                    value={filters.role}
                    onChange={(v) => onFiltersChange({ ...filters, role: v })}
                    options={roles.map((r) => ({ value: r.name, label: r.name }))}
                    allLabel="All roles"
                    searchPlaceholder="Search roles…"
                  />
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

      {/* Refresh */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isFetching}
        className="gap-1.5"
        title="Refresh"
      >
        {isFetching ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
        Refresh
      </Button>

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

interface SearchableSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  allLabel?: string;
  searchPlaceholder?: string;
}

function SearchableSelect({
  value,
  onChange,
  options,
  allLabel = "All",
  searchPlaceholder = "Search…",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const selectedLabel = value ? (options.find((o) => o.value === value)?.label ?? value) : allLabel;

  const handleOpen = () => {
    setOpen(true);
    // Focus the search input after the dropdown renders
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery("");
  };

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full h-9 pl-3 pr-8 relative flex items-center text-left rounded-lg border border-input bg-background text-sm transition-colors hover:bg-muted/50 ${
          value ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        <span className="flex-1 truncate">{selectedLabel}</span>
        <ChevronDown
          size={13}
          className={`absolute right-2.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={close}
            onKeyDown={(e) => e.key === "Escape" && close()}
            role="presentation"
          />
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden min-w-[160px]">
            {/* Search input */}
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-1.5 h-7 px-2 bg-muted rounded-md">
                <Search size={12} className="text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="flex-1 text-[12.5px] bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-44 overflow-y-auto py-1">
              {/* "All" option */}
              <button
                type="button"
                onClick={() => select("")}
                className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-muted transition-colors flex items-center gap-2 ${
                  !value ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {!value ? <Check size={12} className="shrink-0" /> : <span className="w-3 shrink-0" />}
                <span>{allLabel}</span>
              </button>

              {filtered.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => select(o.value)}
                  className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-muted transition-colors flex items-center gap-2 ${
                    value === o.value ? "text-primary font-medium" : "text-foreground"
                  }`}
                >
                  {value === o.value ? <Check size={12} className="shrink-0" /> : <span className="w-3 shrink-0" />}
                  <span>{o.label}</span>
                </button>
              ))}

              {filtered.length === 0 && (
                <p className="px-3 py-2 text-[12.5px] text-muted-foreground text-center">No roles found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
