import { getProjectName } from "./prompts.js";
import { scaffoldProject } from "./scaffold.js";
import { printNextSteps } from "./post-install.js";

async function main(): Promise<void> {
  const cliArg = process.argv[2];
  const projectName = await getProjectName(cliArg);
  await scaffoldProject(projectName);
  printNextSteps(projectName);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
