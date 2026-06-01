import type { DashboardStatsRaw } from "../../repositories/dashboard.repository.js";
import type { RoleExportRow } from "../../repositories/role.repository.js";
import type { UserExportRow } from "../../repositories/user.repository.js";
import { buildWorkbook, type TableSheet } from "./table-workbook.js";

export interface DashboardExportData {
  stats: DashboardStatsRaw;
  users?: UserExportRow[];
  roles?: RoleExportRow[];
}

/**
 * Builds the multi-sheet dashboard report. The Summary sheet is always present;
 * Users and Roles sheets are included only when their data is provided.
 */
export function buildDashboardWorkbook(data: DashboardExportData): Promise<Buffer> {
  const tables: TableSheet[] = [summaryTable(data.stats)];

  if (data.users) tables.push(usersTable(data.users));
  if (data.roles) tables.push(rolesTable(data.roles));

  return buildWorkbook(tables);
}

function summaryTable(stats: DashboardStatsRaw): TableSheet {
  return {
    sheetName: "Summary",
    tableName: "Summary",
    columns: ["Metric", "Value"],
    rows: [
      ["Total Users", stats.totalUsers],
      ["New Users This Week", stats.newUsersThisWeek],
      ["Inactive Users", stats.inactiveUsers],
      ["Total Roles", stats.totalRoles],
      ["Total Permissions Assigned", stats.totalPermissionsAssigned],
      ["Total Permissions", stats.totalPermissions],
    ],
  };
}

function usersTable(users: UserExportRow[]): TableSheet {
  return {
    sheetName: "Users",
    tableName: "Users",
    columns: ["ID", "Full Name", "Email", "Active", "Roles", "Created At"],
    rows: users.map((user) => [
      user.id,
      user.fullName,
      user.email,
      user.isActive,
      user.roles.join(", "),
      user.createdAt,
    ]),
  };
}

function rolesTable(roles: RoleExportRow[]): TableSheet {
  return {
    sheetName: "Roles",
    tableName: "Roles",
    columns: ["ID", "Name", "Permissions Count"],
    rows: roles.map((role) => [role.id, role.name, role.permissionCount]),
  };
}
