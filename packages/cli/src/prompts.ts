import { input } from "@inquirer/prompts";

export async function getProjectName(cliArg?: string): Promise<string> {
  if (cliArg) {
    return sanitize(cliArg);
  }

  const answer = await input({
    message: "Project name:",
    default: "my-dashboard",
    validate: (v) => v.trim().length > 0 || "Project name cannot be empty",
  });

  return sanitize(answer);
}

function sanitize(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}
