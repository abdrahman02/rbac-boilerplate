import { asyncHandler } from "../lib/async-handler.js";
import { sendBadRequest, sendCreated, sendNotFound, sendSuccess } from "../lib/http-response.js";
import { parseId, parsePagination, parseQueryString } from "../lib/request-parser.js";
import type {
  AssignPermissionInput,
  CreateRoleInput,
  SyncPermissionsInput,
  UpdateRoleInput,
} from "../schemas/role.schema.js";
import * as svc from "../services/role.service.js";

const INVALID_ROLE_ID = "Invalid role ID";
const ROLE_NOT_FOUND = "Role not found";

export const listRoles = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const search = parseQueryString(req.query.search);
  const permission = parseQueryString(req.query.permission);

  const result = await svc.listRoles(page, limit, search, permission);
  res.status(200).json(result);
});

export const getRole = asyncHandler(async (req, res) => {
  const roleId = parseId(req.params.id);
  if (roleId === null) return sendBadRequest(res, INVALID_ROLE_ID);

  const role = await svc.getRole(roleId);
  if (!role) return sendNotFound(res, ROLE_NOT_FOUND);

  sendSuccess(res, role);
});

export const createRole = asyncHandler(async (req, res) => {
  const input = req.body as CreateRoleInput;
  const roleId = await svc.createRole(input);

  const role = await svc.getRole(roleId);
  sendCreated(res, role);
});

export const updateRole = asyncHandler(async (req, res) => {
  const roleId = parseId(req.params.id);
  if (roleId === null) return sendBadRequest(res, INVALID_ROLE_ID);

  const input = req.body as UpdateRoleInput;
  const updated = await svc.updateRole(roleId, input);
  if (!updated) return sendNotFound(res, ROLE_NOT_FOUND);

  const role = await svc.getRole(roleId);
  sendSuccess(res, role);
});

export const deleteRole = asyncHandler(async (req, res) => {
  const roleId = parseId(req.params.id);
  if (roleId === null) return sendBadRequest(res, INVALID_ROLE_ID);

  const deleted = await svc.deleteRole(roleId);
  if (!deleted) return sendNotFound(res, ROLE_NOT_FOUND);

  sendSuccess(res, null);
});

export const assignPermission = asyncHandler(async (req, res) => {
  const roleId = parseId(req.params.id);
  if (roleId === null) return sendBadRequest(res, INVALID_ROLE_ID);

  const input = req.body as AssignPermissionInput;
  await svc.assignPermission(roleId, input.permission_id);

  const role = await svc.getRole(roleId);
  sendSuccess(res, role);
});

export const syncPermissions = asyncHandler(async (req, res) => {
  const roleId = parseId(req.params.id);
  if (roleId === null) return sendBadRequest(res, INVALID_ROLE_ID);

  const input = req.body as SyncPermissionsInput;
  await svc.syncPermissions(roleId, input.permission_ids);

  const role = await svc.getRole(roleId);
  sendSuccess(res, role);
});

export const removePermission = asyncHandler(async (req, res) => {
  const roleId = parseId(req.params.id);
  const permissionId = parseId(req.params.permissionId);
  if (roleId === null || permissionId === null) {
    return sendBadRequest(res, "Invalid role ID or permission ID");
  }

  const removed = await svc.removePermission(roleId, permissionId);
  if (!removed) return sendNotFound(res, "Role or permission not found");

  const role = await svc.getRole(roleId);
  sendSuccess(res, role);
});

export const exportRoles = asyncHandler(async (req, res) => {
  const search = parseQueryString(req.query.search);
  const permission = parseQueryString(req.query.permission);

  const buffer = await svc.buildRolesExportWorkbook(search, permission);
  const dateStr = new Date().toISOString().slice(0, 10);

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="roles-${dateStr}.xlsx"`);
  res.send(buffer);
});
