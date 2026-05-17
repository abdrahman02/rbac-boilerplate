import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requirePermission } from '../middleware/permission.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { createPermissionSchema, updatePermissionSchema } from '../schemas/permission.schema.js'
import * as ctrl from '../controllers/permission.controller.js'

const router = Router()

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: List all permissions
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Permissions list
 */
router.get('/', authMiddleware, requirePermission('permissions:read'), ctrl.listPermissions)

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Permission details
 *       404:
 *         description: Permission not found
 */
router.get('/:id', authMiddleware, requirePermission('permissions:read'), ctrl.getPermission)

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create new permission
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, description: "Format: resource:action (e.g., users:read)" }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Permission created
 *       409:
 *         description: Permission name already exists
 */
router.post('/', authMiddleware, requirePermission('permissions:create'), validate(createPermissionSchema), ctrl.createPermission)

/**
 * @swagger
 * /api/permissions/{id}:
 *   patch:
 *     summary: Update permission
 *     tags: [Permissions]
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
 *         description: Permission updated
 *       404:
 *         description: Permission not found
 */
router.patch('/:id', authMiddleware, requirePermission('permissions:update'), validate(updatePermissionSchema), ctrl.updatePermission)

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Delete permission
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Permission deleted
 *       404:
 *         description: Permission not found
 */
router.delete('/:id', authMiddleware, requirePermission('permissions:delete'), ctrl.deletePermission)

export default router
