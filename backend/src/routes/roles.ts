import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requirePermission } from '../middleware/permission.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { createRoleSchema, updateRoleSchema, assignPermissionSchema, syncPermissionsSchema } from '../schemas/role.schema.js'
import { auditLog } from '../middleware/audit-log.middleware.js'
import * as ctrl from '../controllers/role.controller.js'

const router = Router()

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: List all roles
 *     tags: [Roles]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Roles list
 */
router.get('/', authMiddleware, requirePermission(['roles:read', 'users:read', 'users:update']), ctrl.listRoles)

/**
 * @swagger
 * /api/roles/export:
 *   get:
 *     summary: Export all roles to Excel
 *     tags: [Roles]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: permission
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Excel file with roles data
 */
router.get('/export', authMiddleware, requirePermission('roles:read'), ctrl.exportRoles)

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Role details
 *       404:
 *         description: Role not found
 */
router.get('/:id', authMiddleware, requirePermission('roles:read'), ctrl.getRole)

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create new role
 *     tags: [Roles]
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
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Role created
 *       409:
 *         description: Role name already exists
 */
router.post('/', authMiddleware, requirePermission('roles:create'), validate(createRoleSchema), auditLog('create_role', 'role'), ctrl.createRole)

/**
 * @swagger
 * /api/roles/{id}:
 *   patch:
 *     summary: Update role
 *     tags: [Roles]
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
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Role updated
 *       404:
 *         description: Role not found
 */
router.patch('/:id', authMiddleware, requirePermission('roles:update'), validate(updateRoleSchema), auditLog('update_role', 'role'), ctrl.updateRole)

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete role
 *     tags: [Roles]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Role deleted
 *       404:
 *         description: Role not found
 */
router.delete('/:id', authMiddleware, requirePermission('roles:delete'), auditLog('delete_role', 'role'), ctrl.deleteRole)

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   post:
 *     summary: Assign permission to role
 *     tags: [Roles]
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
 *               permission_id: { type: integer }
 *     responses:
 *       200:
 *         description: Permission assigned
 */
router.post('/:id/permissions', authMiddleware, requirePermission('roles:update'), validate(assignPermissionSchema), auditLog('assign_permission', 'role'), ctrl.assignPermission)

router.put('/:id/permissions', authMiddleware, requirePermission('roles:update'), validate(syncPermissionsSchema), auditLog('sync_permissions', 'role'), ctrl.syncPermissions)

/**
 * @swagger
 * /api/roles/{id}/permissions/{permissionId}:
 *   delete:
 *     summary: Remove permission from role
 *     tags: [Roles]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Permission removed
 */
router.delete('/:id/permissions/:permissionId', authMiddleware, requirePermission('roles:update'), auditLog('remove_permission', 'role'), ctrl.removePermission)

export default router
