import { asyncHandler } from "../lib/async-handler.js";
import { sendBadRequest, sendCreated, sendSuccess } from "../lib/http-response.js";
import { parseId } from "../lib/request-parser.js";
import { sseRegistry } from "../lib/sse-registry.js";
import type { BroadcastNotificationInput } from "../schemas/notification.schema.js";
import * as svc from "../services/notification.service.js";

export const streamNotifications = asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseRegistry.add(userId, res);

  const heartbeat = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 30_000);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseRegistry.remove(userId);
  });
});

export const listNotifications = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const result = await svc.getNotifications(userId);
  res.status(200).json(result);
});

export const broadcastNotification = asyncHandler(async (req, res) => {
  const senderId = req.user!.id;
  const input = req.body as BroadcastNotificationInput;
  const notification = await svc.broadcast(senderId, input);
  sendCreated(res, {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    created_at: notification.createdAt,
  });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const notificationId = parseId(req.params.id);
  if (notificationId === null) return sendBadRequest(res, "Invalid notification ID");

  await svc.markNotificationAsRead(notificationId, userId);
  sendSuccess(res, null);
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  await svc.markAllNotificationsAsRead(userId);
  sendSuccess(res, null);
});
