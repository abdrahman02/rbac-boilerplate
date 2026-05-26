import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RefreshButton } from "./RefreshButton";

describe("RefreshButton", () => {
  it("renders default label", () => {
    render(<RefreshButton onClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: /refresh/i })).toBeInTheDocument();
  });

  it("renders custom label", () => {
    render(<RefreshButton onClick={vi.fn()} label="Reload" />);
    expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<RefreshButton onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("button is disabled when isLoading is true", () => {
    render(<RefreshButton onClick={vi.fn()} isLoading />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
