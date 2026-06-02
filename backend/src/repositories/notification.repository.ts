import { prisma } from "../lib/prisma.js";
import type { NotificationItem } from "../types/index.js";

/**
 * Creates a notification and associates it with the given role IDs in a single transaction.
 */
export async function createNotificationWithRoles(
  senderId: number,
  title: string,
  message: string,
  roleIds: number[],
): Promise<{ id: number; title: string; message: string; createdAt: Date }> {
  return prisma.$transaction(async (tx) => {
    const notification = await tx.notification.create({
      data: {
        title,
        message,
        createdBy: senderId,
        roles: {
          create: roleIds.map((roleId) => ({ roleId })),
        },
      },
      select: { id: true, title: true, message: true, createdAt: true },
    });
    return notification;
  });
}

/**
 * Returns distinct user IDs that have any of the given role IDs assigned.
 */
export async function findUsersWithRoles(roleIds: number[]): Promise<number[]> {
  const rows = await prisma.userRole.findMany({
    where: { roleId: { in: roleIds } },
    select: { userId: true },
    distinct: ["userId"],
  });
  return rows.map((r) => r.userId);
}

/**
 * Returns the 20 most recent notifications for a user based on their roles,
 * along with the count of unread notifications.
 * `creator` can be null because `createdBy` is nullable (onDelete: SetNull).
 */
export async function findNotificationsForUser(userId: number): Promise<{
  notifications: NotificationItem[];
  unreadCount: number;
}> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    select: { roleId: true },
  });
  const roleIds = userRoles.map((r) => r.roleId);

  if (roleIds.length === 0) {
    return { notifications: [], unreadCount: 0 };
  }

  const [notifications, unreadCount] = await prisma.$transaction([
    prisma.notification.findMany({
      where: { roles: { some: { roleId: { in: roleIds } } } },
      include: {
        creator: { select: { fullName: true } },
        reads: { where: { userId } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.notification.count({
      where: {
        roles: { some: { roleId: { in: roleIds } } },
        reads: { none: { userId } },
      },
    }),
  ]);

  return {
    notifications: notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      is_read: n.reads.length > 0,
      // creator can be null when the sender user has been deleted (onDelete: SetNull)
      creator_name: n.creator?.fullName ?? "System",
      created_at: n.createdAt,
    })),
    unreadCount,
  };
}

/**
 * Marks a single notification as read for the given user (upsert — safe to call multiple times).
 */
export async function markAsRead(notificationId: number, userId: number): Promise<void> {
  await prisma.notificationRead.upsert({
    where: { notificationId_userId: { notificationId, userId } },
    create: { notificationId, userId },
    update: {},
  });
}

/**
 * Marks all unread notifications for a user as read in bulk.
 */
export async function markAllAsRead(userId: number): Promise<void> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    select: { roleId: true },
  });
  const roleIds = userRoles.map((r) => r.roleId);

  if (roleIds.length === 0) return;

  const unread = await prisma.notification.findMany({
    where: {
      roles: { some: { roleId: { in: roleIds } } },
      reads: { none: { userId } },
    },
    select: { id: true },
  });

  if (unread.length === 0) return;

  await prisma.notificationRead.createMany({
    data: unread.map((n) => ({ notificationId: n.id, userId })),
    skipDuplicates: true,
  });
}
