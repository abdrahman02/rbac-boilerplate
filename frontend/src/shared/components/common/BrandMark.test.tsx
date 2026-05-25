import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandMark } from "./BrandMark";

describe("BrandMark", () => {
  it("shows app name and subtitle when not collapsed", () => {
    render(<BrandMark />);
    expect(screen.getByText("RBAC")).toBeInTheDocument();
    expect(screen.getByText("Access Management")).toBeInTheDocument();
  });

  it("hides app name and subtitle when collapsed=true", () => {
    render(<BrandMark collapsed />);
    expect(screen.queryByText("RBAC")).not.toBeInTheDocument();
    expect(screen.queryByText("Access Management")).not.toBeInTheDocument();
  });

  it('does not use hardcoded fill="white" in SVG', () => {
    const { container } = render(<BrandMark />);
    expect(container.querySelectorAll('[fill="white"]').length).toBe(0);
  });

  it("icon wrapper uses bg-primary class", () => {
    const { container } = render(<BrandMark />);
    expect(container.querySelector(".bg-primary")).toBeInTheDocument();
  });
});
