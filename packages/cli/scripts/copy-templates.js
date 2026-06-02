#!/usr/bin/env node
import fsExtra from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const { copy, emptyDir, ensureDir, readJson, writeJson } = fsExtra;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const TEMPLATES_DIR = path.resolve(__dirname, "../templates");

// Directory names to skip, matched as exact path segments (not substrings)
// so that, e.g., a ".git" pattern never matches a ".gitignore" file.
const EXCLUDE_DIRS = [
  "node_modules",
  ".next",
  "dist",
  "generated",
  ".claude",
  "superpowers",
  ".superpowers",
  ".git",
  "coverage",
];

const EXCLUDE_BASENAMES = [
  ".env",
  ".env.local",
  ".env.production",
  "tsconfig.tsbuildinfo",
];

/**
 * Builds a filter for `fs-extra.copy`, evaluating paths relative to `srcRoot`
 * so ancestor directories never cause false exclusions.
 */
function makeFilter(srcRoot) {
  return (src) => {
    const relative = path.relative(srcRoot, src);
    if (relative === "") return true;

    const segments = relative.split(path.sep);
    if (segments.some((segment) => EXCLUDE_DIRS.includes(segment))) return false;
    if (EXCLUDE_BASENAMES.includes(path.basename(src))) return false;
    return true;
  };
}

/**
 * Removes monorepo-only entries from the scaffolded root package.json:
 * the `packages/cli` workspace and its `build:cli` script do not exist in
 * a generated project.
 */
async function cleanRootPackageJson() {
  const pkgPath = path.join(TEMPLATES_DIR, "root", "package.json");
  const pkg = await readJson(pkgPath);

  if (Array.isArray(pkg.workspaces)) {
    pkg.workspaces = pkg.workspaces.filter((w) => w !== "packages/cli");
  }
  if (pkg.scripts) {
    delete pkg.scripts["build:cli"];
  }
  pkg.name = "rbac-app";
  pkg.private = true;

  await writeJson(pkgPath, pkg, { spaces: 2 });
}

async function main() {
  console.log("Preparing CLI templates...");

  await emptyDir(TEMPLATES_DIR);
  await ensureDir(path.join(TEMPLATES_DIR, "root"));

  console.log("  Copying backend/...");
  const backendSrc = path.join(REPO_ROOT, "backend");
  await copy(backendSrc, path.join(TEMPLATES_DIR, "backend"), {
    filter: makeFilter(backendSrc),
  });

  console.log("  Copying frontend/...");
  const frontendSrc = path.join(REPO_ROOT, "frontend");
  await copy(frontendSrc, path.join(TEMPLATES_DIR, "frontend"), {
    filter: makeFilter(frontendSrc),
  });

  console.log("  Copying root files...");
  const rootFiles = ["package.json", ".env.example", ".gitignore"];
  for (const file of rootFiles) {
    const src = path.join(REPO_ROOT, file);
    await copy(src, path.join(TEMPLATES_DIR, "root", file)).catch(() => {
      console.warn(`  Warning: ${file} not found at root, skipping.`);
    });
  }

  console.log("  Copying docs/...");
  const docsSrc = path.join(REPO_ROOT, "docs");
  await copy(docsSrc, path.join(TEMPLATES_DIR, "root", "docs"), {
    filter: makeFilter(docsSrc),
  }).catch(() => {
    console.warn("  Warning: docs/ not found, skipping.");
  });

  console.log("  Cleaning root package.json...");
  await cleanRootPackageJson();

  console.log("Templates ready.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
