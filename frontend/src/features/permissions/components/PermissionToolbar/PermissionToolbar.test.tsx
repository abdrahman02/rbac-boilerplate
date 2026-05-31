import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PermissionToolbar } from "./PermissionToolbar";

const baseProps = {
  search: "",
  onSearchChange: vi.fn(),
  filters: { usage: "" },
  onFiltersChange: vi.fn(),
  activeFilterCount: 0,
  onClearFilters: undefined,
  canCreate: false,
  isFetching: false,
  onAddPermission: vi.fn(),
  onRefresh: vi.fn(),
  isExporting: false,
  onExport: vi.fn(),
};

describe("PermissionToolbar — Export button", () => {
  it("renders the Export button", () => {
    render(<PermissionToolbar {...baseProps} />);
    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
  });

  it("Export button is enabled when isExporting is false", () => {
    render(<PermissionToolbar {...baseProps} isExporting={false} />);
    expect(screen.getByRole("button", { name: /export/i })).not.toBeDisabled();
  });

  it("Export button is disabled when isExporting is true", () => {
    render(<PermissionToolbar {...baseProps} isExporting={true} />);
    expect(screen.getByRole("button", { name: /export/i })).toBeDisabled();
  });

  it("calls onExport when Export button is clicked", () => {
    const onExport = vi.fn();
    render(<PermissionToolbar {...baseProps} onExport={onExport} />);
    fireEvent.click(screen.getByRole("button", { name: /export/i }));
    expect(onExport).toHaveBeenCalledOnce();
  });
});
