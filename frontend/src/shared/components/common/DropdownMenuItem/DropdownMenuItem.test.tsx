import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenuItem } from "./DropdownMenuItem";

describe("DropdownMenuItem", () => {
  it("renders children text", () => {
    render(<DropdownMenuItem onClick={vi.fn()}>Edit user</DropdownMenuItem>);
    expect(screen.getByText("Edit user")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<DropdownMenuItem onClick={onClick}>Edit user</DropdownMenuItem>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies destructive text color when destructive prop is true", () => {
    render(
      <DropdownMenuItem onClick={vi.fn()} destructive>
        Delete user
      </DropdownMenuItem>,
    );
    expect(screen.getByRole("button")).toHaveClass("text-destructive");
  });

  it("does not apply destructive class by default", () => {
    render(<DropdownMenuItem onClick={vi.fn()}>Edit user</DropdownMenuItem>);
    expect(screen.getByRole("button")).not.toHaveClass("text-destructive");
  });
});
