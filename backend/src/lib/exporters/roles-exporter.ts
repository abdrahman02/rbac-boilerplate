import type { RoleRow } from "../../repositories/role.repository.js";
import { buildWorkbook } from "./table-workbook.js";

/**
 * Builds a single-sheet Roles export workbook from paginated role rows.
 */
export function buildRolesWorkbook(roles: RoleRow[]): Promise<Buffer> {
  return buildWorkbook([
    {
      sheetName: "Roles",
      tableName: "Roles",
      columns: ["Name", "Description", "Permissions", "User Count", "Created At"],
      rows: roles.map((role) => [
        role.name,
        role.description ?? "",
        role.permissions.join(", "),
        role.users.length,
        role.createdAt.toISOString().slice(0, 10),
      ]),
    },
  ]);
}
