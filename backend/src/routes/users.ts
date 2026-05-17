import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requirePermission } from '../middleware/permission.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { createUserSchema, updateUserSchema, assignRoleSchema } from '../schemas/user.schema.js'
import { auditLog } from '../middleware/audit-log.middleware.js'
import * as ctrl from '../controllers/user.controller.js'

const router = Router()

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
router.get('/', authMiddleware, requirePermission('users:read'), ctrl.listUsers)

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
router.get('/:id', authMiddleware, requirePermission('users:read'), ctrl.getUser)

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
router.post('/', authMiddleware, requirePermission('users:create'), validate(createUserSchema), auditLog('create_user', 'user'), ctrl.createUser)

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
router.patch('/:id', authMiddleware, requirePermission('users:update'), validate(updateUserSchema), auditLog('update_user', 'user'), ctrl.updateUser)

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
router.delete('/:id', authMiddleware, requirePermission('users:delete'), auditLog('delete_user', 'user'), ctrl.deleteUser)

/**
 * @swagger
 * /api/users/{id}/roles:
 *   post:
 *     summary: Assign role to user
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
 *               role_id: { type: integer }
 *     responses:
 *       200:
 *         description: Role assigned
 */
router.post('/:id/roles', authMiddleware, requirePermission('users:update'), validate(assignRoleSchema), auditLog('assign_role', 'user'), ctrl.assignRole)

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
router.delete('/:id/roles/:roleId', authMiddleware, requirePermission('users:update'), auditLog('remove_role', 'user'), ctrl.removeRole)

export default router
