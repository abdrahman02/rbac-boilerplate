import { asyncHandler } from "../lib/async-handler.js";
import { sendBadRequest, sendCreated, sendNotFound, sendSuccess } from "../lib/http-response.js";
import { parseId, parsePagination, parseQueryString } from "../lib/request-parser.js";
import type { CreatePermissionInput, UpdatePermissionInput } from "../schemas/permission.schema.js";
import * as svc from "../services/permission.service.js";

const INVALID_PERMISSION_ID = "Invalid permission ID";
const PERMISSION_NOT_FOUND = "Permission not found";

export const listPermissions = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const search = parseQueryString(req.query.search);
  const usage = parseQueryString(req.query.usage);

  const result = await svc.listPermissions(page, limit, search, usage);
  res.status(200).json(result);
});

export const getPermission = asyncHandler(async (req, res) => {
  const permissionId = parseId(req.params.id);
  if (permissionId === null) return sendBadRequest(res, INVALID_PERMISSION_ID);

  const permission = await svc.getPermission(permissionId);
  if (!permission) return sendNotFound(res, PERMISSION_NOT_FOUND);

  sendSuccess(res, permission);
});

export const createPermission = asyncHandler(async (req, res) => {
  const input = req.body as CreatePermissionInput;
  const permissionId = await svc.createPermission(input);

  const permission = await svc.getPermission(permissionId);
  sendCreated(res, permission);
});

export const updatePermission = asyncHandler(async (req, res) => {
  const permissionId = parseId(req.params.id);
  if (permissionId === null) return sendBadRequest(res, INVALID_PERMISSION_ID);

  const input = req.body as UpdatePermissionInput;
  const updated = await svc.updatePermission(permissionId, input);
  if (!updated) return sendNotFound(res, PERMISSION_NOT_FOUND);

  const permission = await svc.getPermission(permissionId);
  sendSuccess(res, permission);
});

export const deletePermission = asyncHandler(async (req, res) => {
  const permissionId = parseId(req.params.id);
  if (permissionId === null) return sendBadRequest(res, INVALID_PERMISSION_ID);

  const deleted = await svc.deletePermission(permissionId);
  if (!deleted) return sendNotFound(res, PERMISSION_NOT_FOUND);

  sendSuccess(res, null);
});

export const exportPermissions = asyncHandler(async (req, res) => {
  const search = parseQueryString(req.query.search);
  const usage = parseQueryString(req.query.usage);

  const buffer = await svc.buildPermissionsExportWorkbook(search, usage);
  const dateStr = new Date().toISOString().slice(0, 10);

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="permissions-${dateStr}.xlsx"`);
  res.send(buffer);
});
