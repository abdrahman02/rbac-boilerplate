import chalk from "chalk";

export function printNextSteps(projectName: string): void {
  console.log(`
${chalk.green("  ✔ Done!")} Your RBAC project is ready.

  ${chalk.bold("Next steps:")}

  ${chalk.cyan(`cd ${projectName}`)}
  ${chalk.cyan("cp backend/.env.example backend/.env")}   ${chalk.gray("# fill in DB credentials + JWT secrets")}
  ${chalk.cyan("npm install")}
  ${chalk.cyan("npm run migrate")}
  ${chalk.cyan("npm run seed")}
  ${chalk.cyan("npm run create-admin")}
  ${chalk.cyan("npm run dev:backend")}                    ${chalk.gray("# http://localhost:3001")}
  ${chalk.cyan("npm run dev:frontend")}                   ${chalk.gray("# http://localhost:3000")}

  ${chalk.gray("API docs:")} ${chalk.underline("http://localhost:3001/api/docs")}
`);
}
