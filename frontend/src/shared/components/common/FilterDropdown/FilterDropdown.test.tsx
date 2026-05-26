import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FilterDropdown } from "./FilterDropdown";

describe("FilterDropdown", () => {
  it("renders Filters trigger button", () => {
    render(<FilterDropdown><span>content</span></FilterDropdown>);
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("opens panel with children on trigger click", () => {
    render(
      <FilterDropdown>
        <span>filter field</span>
      </FilterDropdown>,
    );
    fireEvent.click(screen.getByText("Filters"));
    expect(screen.getByText("filter field")).toBeInTheDocument();
  });

  it("shows active count badge when activeCount > 0", () => {
    render(<FilterDropdown activeCount={2}><span /></FilterDropdown>);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("does not show badge when activeCount is 0", () => {
    render(<FilterDropdown activeCount={0}><span /></FilterDropdown>);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("shows Clear all button when activeCount > 0 and onClearAll provided", () => {
    render(
      <FilterDropdown activeCount={1} onClearAll={vi.fn()}>
        <span />
      </FilterDropdown>,
    );
    fireEvent.click(screen.getByText("Filters"));
    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });

  it("calls onClearAll when Clear all clicked", () => {
    const onClearAll = vi.fn();
    render(
      <FilterDropdown activeCount={1} onClearAll={onClearAll}>
        <span />
      </FilterDropdown>,
    );
    fireEvent.click(screen.getByText("Filters"));
    fireEvent.click(screen.getByText("Clear all"));
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it("does not show Clear all when onClearAll is not provided", () => {
    render(
      <FilterDropdown activeCount={1}>
        <span />
      </FilterDropdown>,
    );
    fireEvent.click(screen.getByText("Filters"));
    expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
  });
});
