import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RowActionsDropdown } from "./RowActionsDropdown";

describe("RowActionsDropdown", () => {
  it("renders an accessible trigger button", () => {
    render(
      <RowActionsDropdown>
        <button type="button">Item</button>
      </RowActionsDropdown>,
    );
    expect(screen.getByTitle("Row actions")).toBeInTheDocument();
  });

  it("shows children after trigger click", () => {
    render(
      <RowActionsDropdown>
        <button type="button">Edit</button>
      </RowActionsDropdown>,
    );
    fireEvent.click(screen.getByTitle("Row actions"));
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("hides children before trigger click", () => {
    render(
      <RowActionsDropdown>
        <button type="button">Edit</button>
      </RowActionsDropdown>,
    );
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });
});
