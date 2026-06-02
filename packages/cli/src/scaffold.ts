import fsExtra from "fs-extra";

const { copy, outputJson, readJson, pathExists } = fsExtra;
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, "../templates");

// Directory names to skip, matched as exact path segments (not substrings).
// Matching by segment avoids false positives when the package itself is
// installed under a `node_modules/` path (e.g. via `npx`).
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

const EXCLUDE_BASENAMES = [".env", ".env.local", ".env.production"];

/**
 * Builds a filter for `fs-extra.copy` that decides which paths to keep.
 * Paths are evaluated relative to `srcRoot` so that ancestor directories
 * (such as a `node_modules/` folder the package is installed into) never
 * cause every file to be excluded.
 */
function makeFilter(srcRoot: string): (src: string) => boolean {
  return (src: string) => {
    const relative = path.relative(srcRoot, src);
    if (relative === "") return true; // always include the root itself

    const segments = relative.split(path.sep);
    if (segments.some((segment) => EXCLUDE_DIRS.includes(segment))) return false;
    if (EXCLUDE_BASENAMES.includes(path.basename(src))) return false;
    return true;
  };
}

/**
 * Scaffolds a new RBAC project into a directory named `projectName`
 * under the current working directory.
 */
export async function scaffoldProject(projectName: string): Promise<void> {
  const targetDir = path.resolve(process.cwd(), projectName);

  console.log(chalk.cyan(`\n  Scaffolding into ${chalk.bold(projectName)}/...\n`));

  // Copy backend template, excluding unwanted directories
  const backendSrc = path.join(TEMPLATES_DIR, "backend");
  await copy(backendSrc, path.join(targetDir, "backend"), {
    filter: makeFilter(backendSrc),
  });

  // Copy frontend template, excluding unwanted directories
  const frontendSrc = path.join(TEMPLATES_DIR, "frontend");
  await copy(frontendSrc, path.join(targetDir, "frontend"), {
    filter: makeFilter(frontendSrc),
  });

  // Copy root-level files (package.json, .env.example, etc.) if they exist
  const rootTemplates = path.join(TEMPLATES_DIR, "root");
  if (await pathExists(rootTemplates)) {
    await copy(rootTemplates, targetDir, { overwrite: false });
  }

  // Update the project name in the copied root package.json
  await updateProjectName(targetDir, projectName);

  console.log(chalk.green("  ✔ Template files copied"));
}

/**
 * Updates the `name` field in the project's root package.json.
 * No-ops if the file does not exist.
 */
async function updateProjectName(targetDir: string, projectName: string): Promise<void> {
  const pkgPath = path.join(targetDir, "package.json");
  if (!(await pathExists(pkgPath))) return;

  const pkg = await readJson(pkgPath);
  const updated = { ...pkg, name: projectName };
  await outputJson(pkgPath, updated, { spaces: 2 });
}
