import chalk from "chalk";

export function printNextSteps(projectName: string): void {
  console.log(`
${chalk.green("  ✔ Done!")} Your RBAC project is ready.

  ${chalk.bold("Next steps:")}

  ${chalk.cyan(`cd ${projectName}`)}

  ${chalk.gray("1. Configure environment")}
  ${chalk.cyan("cp backend/.env.example backend/.env")}          ${chalk.gray("# fill in DB credentials + JWT secrets")}
  ${chalk.cyan("cp frontend/.env.example frontend/.env.local")}

  ${chalk.gray("2. Create the MySQL database (run once in your MySQL client)")}
  ${chalk.cyan("CREATE DATABASE rbac_db;")}

  ${chalk.gray("3. Install dependencies & generate the Prisma client")}
  ${chalk.cyan("npm install")}
  ${chalk.cyan("npm run prisma:generate")}

  ${chalk.gray("4. Set up the database & admin user")}
  ${chalk.cyan("npm run migrate")}
  ${chalk.cyan("npm run seed")}
  ${chalk.cyan("npm run create-admin")}

  ${chalk.gray("5. Start the dev servers (in two terminals)")}
  ${chalk.cyan("npm run dev:backend")}                            ${chalk.gray("# http://localhost:3001")}
  ${chalk.cyan("npm run dev:frontend")}                           ${chalk.gray("# http://localhost:3000")}

  ${chalk.gray("Then log in at")} ${chalk.underline("http://localhost:3000/login")}
  ${chalk.gray("API docs:")}      ${chalk.underline("http://localhost:3001/api/docs")}
  ${chalk.gray("Full setup guide:")} docs/SETUP.md
`);
}
