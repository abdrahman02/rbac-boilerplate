import { sseRegistry } from "../lib/sse-registry.js";
import * as repo from "../repositories/notification.repository.js";
import type { BroadcastNotificationInput } from "../schemas/notification.schema.js";
import type { NotificationItem } from "../types/index.js";

/**
 * Broadcast a notification to users with specific roles.
 * Creates the notification record, then pushes SSE events to all matching online users.
 */
export async function broadcast(
  senderId: number,
  input: BroadcastNotificationInput,
): Promise<{ id: number; title: string; message: string; createdAt: Date }> {
  const notification = await repo.createNotificationWithRoles(senderId, input.title, input.message, input.role_ids);

  const userIds = await repo.findUsersWithRoles(input.role_ids);
  for (const userId of userIds) {
    sseRegistry.push(userId, "new_notification", {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt,
    });
  }

  return notification;
}

/**
 * Retrieve all notifications for a specific user, along with the unread count.
 */
export async function getNotifications(userId: number): Promise<{
  success: boolean;
  data: NotificationItem[];
  meta: { unread_count: number };
}> {
  const { notifications, unreadCount } = await repo.findNotificationsForUser(userId);
  return {
    success: true,
    data: notifications,
    meta: { unread_count: unreadCount },
  };
}

/**
 * Mark a single notification as read for the given user.
 */
export async function markNotificationAsRead(notificationId: number, userId: number): Promise<void> {
  await repo.markAsRead(notificationId, userId);
}

/**
 * Mark all notifications as read for the given user.
 */
export async function markAllNotificationsAsRead(userId: number): Promise<void> {
  await repo.markAllAsRead(userId);
}
