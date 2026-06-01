import type { PermissionRow } from "../../repositories/permission.repository.js";
import { buildWorkbook } from "./table-workbook.js";

/**
 * Builds a single-sheet Permissions export workbook from paginated permission rows.
 */
export function buildPermissionsWorkbook(permissions: PermissionRow[]): Promise<Buffer> {
  return buildWorkbook([
    {
      sheetName: "Permissions",
      tableName: "Permissions",
      columns: ["Name", "Description", "Roles", "Created At"],
      rows: permissions.map((permission) => [
        permission.name,
        permission.description ?? "",
        permission.roles.join(", "),
        permission.createdAt.toISOString().slice(0, 10),
      ]),
    },
  ]);
}
