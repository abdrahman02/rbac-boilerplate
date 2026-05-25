import { describe, expect, it } from "vitest";
import { navGroupChildVariants, navGroupTriggerVariants } from "./NavGroup.variants";

describe("navGroupTriggerVariants", () => {
  it("applies primary/18 bg when activeParent=true", () => {
    const result = navGroupTriggerVariants({ activeParent: true, collapsed: false });
    expect(result).toContain("bg-primary");
    expect(result).toContain("text-primary");
  });

  it("applies sidebar-foreground text when activeParent=false", () => {
    const result = navGroupTriggerVariants({ activeParent: false, collapsed: false });
    expect(result).toContain("text-sidebar-foreground");
  });

  it("applies hover:bg-primary tint when inactive", () => {
    const result = navGroupTriggerVariants({ activeParent: false, collapsed: false });
    expect(result).toContain("hover:bg-primary");
  });

  it("applies justify-center when collapsed=true", () => {
    const result = navGroupTriggerVariants({ activeParent: false, collapsed: true });
    expect(result).toContain("justify-center");
  });

  it("applies justify-start when collapsed=false", () => {
    const result = navGroupTriggerVariants({ activeParent: false, collapsed: false });
    expect(result).toContain("justify-start");
  });
});

describe("navGroupChildVariants", () => {
  it("applies bg-primary when active=true", () => {
    const result = navGroupChildVariants({ active: true });
    expect(result).toContain("bg-primary");
    expect(result).toContain("text-primary-foreground");
  });

  it("applies sidebar-foreground/70 text when active=false", () => {
    const result = navGroupChildVariants({ active: false });
    expect(result).toContain("text-sidebar-foreground");
  });

  it("applies hover:bg-primary tint when inactive", () => {
    const result = navGroupChildVariants({ active: false });
    expect(result).toContain("hover:bg-primary");
  });
});
