import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserToolbar } from "./UserToolbar";

const baseProps = {
  search: "",
  onSearchChange: vi.fn(),
  filters: { role: "", status: "" },
  onFiltersChange: vi.fn(),
  activeFilterCount: 0,
  onClearFilters: undefined,
  roles: [],
  canCreate: false,
  isFetching: false,
  onAddUser: vi.fn(),
  onRefresh: vi.fn(),
  isExporting: false,
  onExport: vi.fn(),
};

describe("UserToolbar — Export button", () => {
  it("renders the Export button", () => {
    render(<UserToolbar {...baseProps} />);
    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
  });

  it("Export button is enabled when isExporting is false", () => {
    render(<UserToolbar {...baseProps} isExporting={false} />);
    expect(screen.getByRole("button", { name: /export/i })).not.toBeDisabled();
  });

  it("Export button is disabled when isExporting is true", () => {
    render(<UserToolbar {...baseProps} isExporting={true} />);
    expect(screen.getByRole("button", { name: /export/i })).toBeDisabled();
  });

  it("calls onExport when Export button is clicked", () => {
    const onExport = vi.fn();
    render(<UserToolbar {...baseProps} onExport={onExport} />);
    fireEvent.click(screen.getByRole("button", { name: /export/i }));
    expect(onExport).toHaveBeenCalledOnce();
  });
});
