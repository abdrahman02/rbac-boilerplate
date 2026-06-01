import { Router } from "express";
import * as ctrl from "../controllers/user.controller.js";
import { auditLog } from "../middleware/audit-log.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createUserSchema, syncRolesSchema, updateUserSchema } from "../schemas/user.schema.js";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Users list
 */
router.get("/", authMiddleware, requirePermission("users:read"), ctrl.listUsers);

/**
 * @swagger
 * /api/users/export:
 *   get:
 *     summary: Export all users to Excel
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Excel file with users data
 */
router.get("/export", authMiddleware, requirePermission("users:read"), ctrl.exportUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/:id", authMiddleware, requirePermission("users:read"), ctrl.getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               role_ids: { type: array, items: { type: integer } }
 *     responses:
 *       201:
 *         description: User created
 *       409:
 *         description: Email already exists
 */
router.post(
  "/",
  authMiddleware,
  requirePermission("users:create"),
  validate(createUserSchema),
  auditLog("create_user", "user"),
  ctrl.createUser,
);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               is_active: { type: boolean }
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id",
  authMiddleware,
  requirePermission("users:update"),
  validate(updateUserSchema),
  auditLog("update_user", "user"),
  ctrl.updateUser,
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (soft delete)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("users:delete"),
  auditLog("delete_user", "user"),
  ctrl.deleteUser,
);

router.put(
  "/:id/roles",
  authMiddleware,
  requirePermission("users:update"),
  validate(syncRolesSchema),
  auditLog("sync_roles", "user"),
  ctrl.syncRoles,
);

/**
 * @swagger
 * /api/users/{id}/roles/{roleId}:
 *   delete:
 *     summary: Remove role from user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Role removed
 */
router.delete(
  "/:id/roles/:roleId",
  authMiddleware,
  requirePermission("users:update"),
  auditLog("remove_role", "user"),
  ctrl.removeRole,
);

export default router;
