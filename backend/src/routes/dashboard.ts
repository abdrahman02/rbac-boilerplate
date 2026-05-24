import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import * as ctrl from '../controllers/dashboard.controller.js'

const router = Router()

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard aggregate statistics
 *     tags: [Dashboard]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Aggregate stats for the dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers: { type: integer }
 *                     newUsersThisWeek: { type: integer }
 *                     inactiveUsers: { type: integer }
 *                     totalRoles: { type: integer }
 *                     totalPermissionsAssigned: { type: integer }
 *                     totalPermissions: { type: integer }
 *                     recentActivity: { type: array }
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authMiddleware, ctrl.stats)

export default router
