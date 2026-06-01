import { asyncHandler } from "../lib/async-handler.js";
import { sendBadRequest, sendCreated, sendNotFound, sendSuccess } from "../lib/http-response.js";
import { parseId, parsePagination, parseQueryString } from "../lib/request-parser.js";
import type { CreateUserInput, SyncRolesInput, UpdateUserInput } from "../schemas/user.schema.js";
import * as svc from "../services/user.service.js";

const INVALID_USER_ID = "Invalid user ID";
const USER_NOT_FOUND = "User not found";

/**
 * Maps the `status` query string ("active"/"inactive") to a boolean filter,
 * or undefined when no recognised value is provided.
 */
function parseStatusFilter(value: unknown): boolean | undefined {
  if (value === "active") return true;
  if (value === "inactive") return false;
  return undefined;
}

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const search = parseQueryString(req.query.search);
  const role = parseQueryString(req.query.role);
  const status = parseStatusFilter(req.query.status);

  const result = await svc.listUsers(page, limit, search, role, status);
  res.status(200).json(result);
});

export const getUser = asyncHandler(async (req, res) => {
  const userId = parseId(req.params.id);
  if (userId === null) return sendBadRequest(res, INVALID_USER_ID);

  const user = await svc.getUser(userId);
  if (!user) return sendNotFound(res, USER_NOT_FOUND);

  sendSuccess(res, user);
});

export const createUser = asyncHandler(async (req, res) => {
  const input = req.body as CreateUserInput;
  const userId = await svc.createUser(input);

  const user = await svc.getUser(userId);
  sendCreated(res, user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const userId = parseId(req.params.id);
  if (userId === null) return sendBadRequest(res, INVALID_USER_ID);

  const input = req.body as UpdateUserInput;
  const updated = await svc.updateUser(userId, input);
  if (!updated) return sendNotFound(res, USER_NOT_FOUND);

  const user = await svc.getUser(userId);
  sendSuccess(res, user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = parseId(req.params.id);
  if (userId === null) return sendBadRequest(res, INVALID_USER_ID);

  const deleted = await svc.deleteUser(userId);
  if (!deleted) return sendNotFound(res, USER_NOT_FOUND);

  sendSuccess(res, null);
});

export const syncRoles = asyncHandler(async (req, res) => {
  const userId = parseId(req.params.id);
  if (userId === null) return sendBadRequest(res, INVALID_USER_ID);

  const input = req.body as SyncRolesInput;
  await svc.syncRoles(userId, input.role_ids);

  const user = await svc.getUser(userId);
  sendSuccess(res, user);
});

export const removeRole = asyncHandler(async (req, res) => {
  const userId = parseId(req.params.id);
  const roleId = parseId(req.params.roleId);
  if (userId === null || roleId === null) {
    return sendBadRequest(res, "Invalid user ID or role ID");
  }

  const removed = await svc.removeRole(userId, roleId);
  if (!removed) return sendNotFound(res, "User or role not found");

  const user = await svc.getUser(userId);
  sendSuccess(res, user);
});

export const exportUsers = asyncHandler(async (req, res) => {
  const search = parseQueryString(req.query.search);
  const role = parseQueryString(req.query.role);
  const status = parseQueryString(req.query.status);

  const buffer = await svc.buildUsersExportWorkbook(search, role, status);
  const dateStr = new Date().toISOString().slice(0, 10);

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="users-${dateStr}.xlsx"`);
  res.send(buffer);
});
