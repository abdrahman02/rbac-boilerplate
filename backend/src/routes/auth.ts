import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { auditLog } from "../middleware/audit-log.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authRateLimit } from "../middleware/rate-limit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  updateMeSchema,
  verifyEmailSchema,
} from "../schemas/auth.schema.js";

const router = Router();

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
 *         description: User registered — verification email sent; account inactive until email is confirmed
 *       409:
 *         description: Email already taken
 *       422:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 */
router.post(
  "/register",
  authRateLimit,
  validate(registerSchema),
  auditLog("register", "auth"),
  authController.register,
);

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
router.post("/login", authRateLimit, validate(loginSchema), auditLog("login", "auth"), authController.login);

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
router.post("/logout", authMiddleware, auditLog("logout", "auth"), authController.logout);

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
router.post("/refresh", authRateLimit, authController.refresh);

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
router.get("/me", authMiddleware, authController.me);

router.patch("/me", authMiddleware, validate(updateMeSchema), authController.updateMe);
router.post("/change-password", authMiddleware, validate(changePasswordSchema), authController.changePassword);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     tags: [Auth]
 *     summary: Verify email address with token from verification email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified, httpOnly cookies set (auto-login)
 *       400:
 *         description: Invalid or expired token
 *       422:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 */
router.post("/verify-email", authRateLimit, validate(verifyEmailSchema), authController.verifyEmail);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     tags: [Auth]
 *     summary: Resend email verification link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification email sent if account exists and is unverified
 *       400:
 *         description: Email already verified
 *       422:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 */
router.post(
  "/resend-verification",
  authRateLimit,
  validate(resendVerificationSchema),
  authController.resendVerification,
);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset link sent (or silently ignored if email not found)
 */
router.post(
  "/forgot-password",
  authRateLimit,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token from email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid or expired reset token
 */
router.post(
  "/reset-password",
  authRateLimit,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
