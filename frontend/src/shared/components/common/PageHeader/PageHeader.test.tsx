import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders the title", () => {
    render(<PageHeader title="Users" />);
    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<PageHeader title="Users" description="Manage workspace members" />);
    expect(screen.getByText("Manage workspace members")).toBeInTheDocument();
  });

  it("does not render description element when omitted", () => {
    render(<PageHeader title="Users" />);
    expect(screen.queryByText("Manage workspace members")).not.toBeInTheDocument();
  });

  it("renders children in the right slot", () => {
    render(
      <PageHeader title="Users">
        <button type="button">Add</button>
      </PageHeader>,
    );
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });
});
