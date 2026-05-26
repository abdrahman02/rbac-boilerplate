import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

const options = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

describe("Select", () => {
  it("shows placeholder when no value is selected", () => {
    render(<Select value="" onChange={vi.fn()} options={options} placeholder="All roles" />);
    expect(screen.getByText("All roles")).toBeInTheDocument();
  });

  it("shows selected option label", () => {
    render(<Select value="admin" onChange={vi.fn()} options={options} placeholder="All roles" />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("opens option list on trigger click", () => {
    render(<Select value="" onChange={vi.fn()} options={options} placeholder="All roles" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("calls onChange with the selected value", () => {
    const onChange = vi.fn();
    render(<Select value="" onChange={onChange} options={options} placeholder="All roles" />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Admin"));
    expect(onChange).toHaveBeenCalledWith("admin");
  });

  it("calls onChange with empty string when placeholder option clicked", () => {
    const onChange = vi.fn();
    render(<Select value="admin" onChange={onChange} options={options} placeholder="All roles" />);
    fireEvent.click(screen.getByRole("button"));
    const allRolesButtons = screen.getAllByText("All roles");
    fireEvent.click(allRolesButtons[allRolesButtons.length - 1]);
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("shows search input when searchable prop is true", () => {
    render(<Select value="" onChange={vi.fn()} options={options} placeholder="All roles" searchable />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("filters options when typing in search input", () => {
    render(<Select value="" onChange={vi.fn()} options={options} placeholder="All roles" searchable />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "admin" } });
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.queryByText("User")).not.toBeInTheDocument();
  });

  it("does not show search input when searchable is false (default)", () => {
    render(<Select value="" onChange={vi.fn()} options={options} placeholder="All roles" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
