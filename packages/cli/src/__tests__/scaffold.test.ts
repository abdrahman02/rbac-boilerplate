import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs-extra";
import path from "path";
import os from "os";

describe("scaffoldProject", () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "rbac-cli-test-"));
    originalCwd = process.cwd();
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.removeSync(tmpDir);
  });

  it("creates backend and frontend directories", async () => {
    const { scaffoldProject } = await import("../scaffold.js");
    await scaffoldProject("test-project");

    expect(fs.existsSync(path.join(tmpDir, "test-project", "backend"))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, "test-project", "frontend"))).toBe(true);
  });

  it("does not copy node_modules or .next", async () => {
    const { scaffoldProject } = await import("../scaffold.js");
    await scaffoldProject("test-project");

    expect(fs.existsSync(path.join(tmpDir, "test-project", "backend", "node_modules"))).toBe(false);
    expect(fs.existsSync(path.join(tmpDir, "test-project", "frontend", ".next"))).toBe(false);
  });

  it("updates project name in root package.json", async () => {
    const { scaffoldProject } = await import("../scaffold.js");
    await scaffoldProject("my-custom-project");

    const pkg = fs.readJsonSync(path.join(tmpDir, "my-custom-project", "package.json"));
    expect(pkg.name).toBe("my-custom-project");
  });

  it("copies .env.example to project root", async () => {
    const { scaffoldProject } = await import("../scaffold.js");
    await scaffoldProject("test-project");

    expect(fs.existsSync(path.join(tmpDir, "test-project", ".env.example"))).toBe(true);
  });
});
