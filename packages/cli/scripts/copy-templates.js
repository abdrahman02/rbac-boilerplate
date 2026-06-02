#!/usr/bin/env node
import { copy, emptyDir, ensureDir } from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const TEMPLATES_DIR = path.resolve(__dirname, "../templates");

const EXCLUDE_PATTERNS = [
  "node_modules",
  ".next",
  "dist",
  "src/generated",
  ".env",
  ".claude",
  "docs/superpowers",
  ".git",
];

function shouldExclude(src) {
  return EXCLUDE_PATTERNS.some((pattern) => src.includes(pattern));
}

async function main() {
  console.log("Preparing CLI templates...");

  await emptyDir(TEMPLATES_DIR);
  await ensureDir(path.join(TEMPLATES_DIR, "root"));

  console.log("  Copying backend/...");
  await copy(path.join(REPO_ROOT, "backend"), path.join(TEMPLATES_DIR, "backend"), {
    filter: (src) => !shouldExclude(src),
  });

  console.log("  Copying frontend/...");
  await copy(path.join(REPO_ROOT, "frontend"), path.join(TEMPLATES_DIR, "frontend"), {
    filter: (src) => !shouldExclude(src),
  });

  console.log("  Copying root files...");
  const rootFiles = ["package.json", ".env.example", ".gitignore"];
  for (const file of rootFiles) {
    const src = path.join(REPO_ROOT, file);
    await copy(src, path.join(TEMPLATES_DIR, "root", file)).catch(() => {
      console.warn(`  Warning: ${file} not found at root, skipping.`);
    });
  }

  console.log("Templates ready.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
