import { Router } from "express";
import * as ctrl from "../controllers/notification.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { broadcastNotificationSchema } from "../schemas/notification.schema.js";

const router = Router();

// PENTING: /stream dan /read-all harus didaftarkan sebelum /:id/read
router.get("/stream", authMiddleware, ctrl.streamNotifications);

router.get("/", authMiddleware, ctrl.listNotifications);

router.post(
  "/broadcast",
  authMiddleware,
  requirePermission("notifications:create"),
  validate(broadcastNotificationSchema),
  ctrl.broadcastNotification,
);

router.patch("/read-all", authMiddleware, ctrl.markAllNotificationsRead);

router.patch("/:id/read", authMiddleware, ctrl.markNotificationRead);

export default router;
