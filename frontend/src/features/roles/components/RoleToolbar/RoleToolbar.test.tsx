import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RoleToolbar } from "./RoleToolbar";

const baseProps = {
  search: "",
  onSearchChange: vi.fn(),
  filters: { permission: "" },
  onFiltersChange: vi.fn(),
  activeFilterCount: 0,
  onClearFilters: undefined,
  filterPermissions: [],
  canCreate: false,
  isFetching: false,
  onAddRole: vi.fn(),
  onRefresh: vi.fn(),
  isExporting: false,
  onExport: vi.fn(),
};

describe("RoleToolbar — Export button", () => {
  it("renders the Export button", () => {
    render(<RoleToolbar {...baseProps} />);
    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
  });

  it("Export button is enabled when isExporting is false", () => {
    render(<RoleToolbar {...baseProps} isExporting={false} />);
    expect(screen.getByRole("button", { name: /export/i })).not.toBeDisabled();
  });

  it("Export button is disabled when isExporting is true", () => {
    render(<RoleToolbar {...baseProps} isExporting={true} />);
    expect(screen.getByRole("button", { name: /export/i })).toBeDisabled();
  });

  it("calls onExport when Export button is clicked", () => {
    const onExport = vi.fn();
    render(<RoleToolbar {...baseProps} onExport={onExport} />);
    fireEvent.click(screen.getByRole("button", { name: /export/i }));
    expect(onExport).toHaveBeenCalledOnce();
  });
});
