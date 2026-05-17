import { Router } from 'express'
import { authRateLimit } from '../middleware/rate-limit.middleware.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'
import * as authController from '../controllers/auth.controller.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Secret123
 *     responses:
 *       201:
 *         description: User registered, httpOnly cookies set
 *       409:
 *         description: Email already taken
 *       422:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 */
router.post('/register', authRateLimit, validate(registerSchema), authController.register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and receive JWT cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, httpOnly cookies set
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 */
router.post('/login', authRateLimit, validate(loginSchema), authController.login)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and revoke refresh token
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out, cookies cleared
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authMiddleware, authController.logout)

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Rotate refresh token and issue new access token
 *     description: Requires the refresh_token httpOnly cookie (sent automatically by browser)
 *     responses:
 *       200:
 *         description: New tokens issued, old refresh token revoked
 *       401:
 *         description: Invalid or expired refresh token
 *       429:
 *         description: Too many requests
 */
router.post('/refresh', authRateLimit, authController.refresh)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user with roles and permissions
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, authController.me)

export default router
