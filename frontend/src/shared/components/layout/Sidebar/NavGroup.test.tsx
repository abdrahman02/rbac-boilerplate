import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { NavGroup } from "./NavGroup";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));
vi.mock("@/shared/components/guard/PermissionGate", () => ({
  PermissionGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/shared/components/ui/Dropdown", () => ({
  Dropdown: ({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) => (
    <div data-testid="dropdown">
      {trigger}
      {children}
    </div>
  ),
}));

import { usePathname } from "next/navigation";

const items = [
  { href: "/roles", label: "Roles", icon: null, permission: "roles:read" as string | null },
  {
    href: "/permissions",
    label: "Permissions",
    icon: null,
    permission: "permissions:read" as string | null,
  },
];

describe("NavGroup", () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
  });

  it("renders group label as a button", () => {
    render(<NavGroup label="Access Control" icon={null} items={items} />);
    expect(screen.getByRole("button", { name: /access control/i })).toBeInTheDocument();
  });

  it("starts closed — children not visible", () => {
    render(<NavGroup label="Access Control" icon={null} items={items} />);
    expect(screen.queryByText("Roles")).not.toBeInTheDocument();
  });

  it("opens on trigger click and shows children", () => {
    render(<NavGroup label="Access Control" icon={null} items={items} />);
    fireEvent.click(screen.getByRole("button", { name: /access control/i }));
    expect(screen.getByText("Roles")).toBeInTheDocument();
    expect(screen.getByText("Permissions")).toBeInTheDocument();
  });

  it("closes again on second trigger click", () => {
    render(<NavGroup label="Access Control" icon={null} items={items} />);
    fireEvent.click(screen.getByRole("button", { name: /access control/i }));
    fireEvent.click(screen.getByRole("button", { name: /access control/i }));
    expect(screen.queryByText("Roles")).not.toBeInTheDocument();
  });

  it("auto-opens when a child path is active", () => {
    vi.mocked(usePathname).mockReturnValue("/roles");
    render(<NavGroup label="Access Control" icon={null} items={items} />);
    act(() => {});
    expect(screen.getByText("Roles")).toBeInTheDocument();
  });

  it("renders via Dropdown when collapsed=true", () => {
    render(<NavGroup label="Access Control" icon={null} items={items} collapsed />);
    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
  });
});
