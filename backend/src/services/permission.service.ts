import { PAGINATION } from "../constants/pagination.js";
import type { Permission } from "../generated/prisma/index.js";
import { buildPermissionsWorkbook } from "../lib/exporters/permissions-exporter.js";
import type { PermissionRow } from "../repositories/permission.repository.js";
import * as repo from "../repositories/permission.repository.js";
import type { CreatePermissionInput, UpdatePermissionInput } from "../schemas/permission.schema.js";
import type { PaginatedResponse } from "../types/index.js";

export async function listPermissions(
  page: number,
  limit: number,
  search?: string,
  usage?: string,
): Promise<PaginatedResponse<PermissionRow>> {
  const { rows, total } = await repo.findAllPermissions(page, limit, search, usage);
  return { success: true, data: rows, meta: { total, page, limit } };
}

export async function getPermission(permissionId: number): Promise<Permission | null> {
  return repo.findPermissionById(permissionId);
}

export async function createPermission(input: CreatePermissionInput): Promise<number> {
  const existing = await repo.findPermissionByName(input.name);
  if (existing) throw new Error("PERMISSION_NAME_TAKEN");

  return repo.createPermission(input.name, input.description);
}

export async function updatePermission(permissionId: number, input: UpdatePermissionInput): Promise<boolean> {
  if (input.name) {
    const existing = await repo.findPermissionByName(input.name);
    if (existing && existing.id !== permissionId) throw new Error("PERMISSION_NAME_TAKEN");
  }

  const updateFields: { name?: string; description?: string | null } = {};
  if (input.name) updateFields.name = input.name;
  if (input.description !== undefined) updateFields.description = input.description;

  return repo.updatePermission(permissionId, updateFields);
}

export async function deletePermission(permissionId: number): Promise<boolean> {
  return repo.deletePermission(permissionId);
}

export async function buildPermissionsExportWorkbook(search?: string, usage?: string): Promise<Buffer> {
  const { rows } = await repo.findAllPermissions(1, PAGINATION.UNPAGINATED, search, usage);
  return buildPermissionsWorkbook(rows);
}
