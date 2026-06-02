import { copy, outputJson, readJson, pathExists } from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, "../templates");

const EXCLUDE_PATTERNS = [
  "node_modules",
  ".next",
  "dist",
  "src/generated",
  ".claude",
  "docs/superpowers",
];

const EXCLUDE_BASENAMES = [".env", ".env.local", ".env.production"];

function shouldExclude(src: string): boolean {
  const basename = path.basename(src);
  if (EXCLUDE_BASENAMES.includes(basename)) return true;
  return EXCLUDE_PATTERNS.some((pattern) => src.includes(pattern));
}

/**
 * Scaffolds a new RBAC project into a directory named `projectName`
 * under the current working directory.
 */
export async function scaffoldProject(projectName: string): Promise<void> {
  const targetDir = path.resolve(process.cwd(), projectName);

  console.log(chalk.cyan(`\n  Scaffolding into ${chalk.bold(projectName)}/...\n`));

  // Copy backend template, excluding unwanted directories
  await copy(path.join(TEMPLATES_DIR, "backend"), path.join(targetDir, "backend"), {
    filter: (src) => !shouldExclude(src),
  });

  // Copy frontend template, excluding unwanted directories
  await copy(path.join(TEMPLATES_DIR, "frontend"), path.join(targetDir, "frontend"), {
    filter: (src) => !shouldExclude(src),
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
