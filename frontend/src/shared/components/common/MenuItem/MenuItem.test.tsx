import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MenuItem } from "./MenuItem";

describe("MenuItem", () => {
  it("renders children text", () => {
    render(<MenuItem onClick={vi.fn()}>Edit user</MenuItem>);
    expect(screen.getByText("Edit user")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<MenuItem onClick={onClick}>Edit user</MenuItem>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies destructive text color when destructive prop is true", () => {
    render(
      <MenuItem onClick={vi.fn()} destructive>
        Delete user
      </MenuItem>,
    );
    expect(screen.getByRole("button")).toHaveClass("text-destructive");
  });

  it("does not apply destructive class by default", () => {
    render(<MenuItem onClick={vi.fn()}>Edit user</MenuItem>);
    expect(screen.getByRole("button")).not.toHaveClass("text-destructive");
  });
});
