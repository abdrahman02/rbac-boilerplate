import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { requirePermission } from '../middleware/permission.middleware.js'
import * as auditLogController from '../controllers/audit-log.controller.js'

const router = Router()

router.use(authMiddleware)

/**
 * @swagger
 * tags:
 *   name: AuditLogs
 *   description: Audit log viewer (read-only)
 */

/**
 * @swagger
 * /audit-logs:
 *   get:
 *     tags: [AuditLogs]
 *     summary: List audit logs with filters and pagination
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *         description: Items per page (max 100)
 *       - in: query
 *         name: user_id
 *         schema: { type: integer }
 *         description: Filter by user ID
 *       - in: query
 *         name: action
 *         schema: { type: string }
 *         description: Filter by action (partial match, e.g. "create" matches "create_user")
 *       - in: query
 *         name: resource_type
 *         schema: { type: string, enum: [auth, user, role, permission] }
 *         description: Filter by resource type
 *       - in: query
 *         name: date_from
 *         schema: { type: string, format: date-time }
 *         description: Filter logs from this datetime (ISO 8601)
 *       - in: query
 *         name: date_to
 *         schema: { type: string, format: date-time }
 *         description: Filter logs until this datetime (ISO 8601)
 *     responses:
 *       200:
 *         description: Paginated audit log list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/AuditLog' }
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — requires audit_logs:read
 */
router.get('/', requirePermission('audit_logs:read'), auditLogController.list)

export default router
