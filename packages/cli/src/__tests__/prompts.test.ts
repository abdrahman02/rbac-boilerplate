import { describe, it, expect } from "vitest";

describe("getProjectName", () => {
  it("returns CLI argument directly without prompting", async () => {
    const { getProjectName } = await import("../prompts.js");
    const name = await getProjectName("my-dashboard");
    expect(name).toBe("my-dashboard");
  });

  it("sanitizes project name: lowercase and replaces spaces with hyphens", async () => {
    const { getProjectName } = await import("../prompts.js");
    const name = await getProjectName("My Dashboard App");
    expect(name).toBe("my-dashboard-app");
  });
});
