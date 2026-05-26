import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActionsMenu } from "./ActionsMenu";

describe("ActionsMenu", () => {
  it("renders an accessible trigger button", () => {
    render(
      <ActionsMenu>
        <button type="button">Item</button>
      </ActionsMenu>,
    );
    expect(screen.getByTitle("Actions")).toBeInTheDocument();
  });

  it("shows children after trigger click", () => {
    render(
      <ActionsMenu>
        <button type="button">Edit</button>
      </ActionsMenu>,
    );
    fireEvent.click(screen.getByTitle("Actions"));
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("hides children before trigger click", () => {
    render(
      <ActionsMenu>
        <button type="button">Edit</button>
      </ActionsMenu>,
    );
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });
});
