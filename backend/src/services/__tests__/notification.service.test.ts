import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../repositories/notification.repository.js", () => ({
  createNotificationWithRoles: vi.fn(),
  findUsersWithRoles: vi.fn(),
  findNotificationsForUser: vi.fn(),
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
}));

vi.mock("../../lib/sse-registry.js", () => ({
  sseRegistry: { push: vi.fn() },
}));

import { sseRegistry } from "../../lib/sse-registry.js";
import * as repo from "../../repositories/notification.repository.js";
import {
  broadcast,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../notification.service.js";

const MOCK_NOTIFICATION = {
  id: 1,
  title: "Test Notification",
  message: "This is a test message",
  createdAt: new Date("2026-06-02T10:00:00Z"),
};

const MOCK_ITEM = {
  id: 1,
  title: "Test Notification",
  message: "This is a test message",
  is_read: false,
  creator_name: "Admin User",
  created_at: new Date("2026-06-02T10:00:00Z"),
};

describe("broadcast", () => {
  beforeEach(() => vi.resetAllMocks());

  it("creates notification and pushes SSE to matching users", async () => {
    vi.mocked(repo.createNotificationWithRoles).mockResolvedValueOnce(MOCK_NOTIFICATION);
    vi.mocked(repo.findUsersWithRoles).mockResolvedValueOnce([2, 3]);

    await broadcast(1, { title: "Test", message: "Hello world!", role_ids: [1] });

    expect(repo.createNotificationWithRoles).toHaveBeenCalledWith(1, "Test", "Hello world!", [1]);
    expect(repo.findUsersWithRoles).toHaveBeenCalledWith([1]);
    expect(sseRegistry.push).toHaveBeenCalledTimes(2);
    expect(sseRegistry.push).toHaveBeenCalledWith(2, "new_notification", expect.objectContaining({ id: 1 }));
    expect(sseRegistry.push).toHaveBeenCalledWith(3, "new_notification", expect.objectContaining({ id: 1 }));
  });

  it("does not call sseRegistry.push when no users have matching roles", async () => {
    vi.mocked(repo.createNotificationWithRoles).mockResolvedValueOnce(MOCK_NOTIFICATION);
    vi.mocked(repo.findUsersWithRoles).mockResolvedValueOnce([]);

    await broadcast(1, { title: "Test", message: "Hello world!", role_ids: [99] });

    expect(sseRegistry.push).not.toHaveBeenCalled();
  });

  it("returns the created notification data", async () => {
    vi.mocked(repo.createNotificationWithRoles).mockResolvedValueOnce(MOCK_NOTIFICATION);
    vi.mocked(repo.findUsersWithRoles).mockResolvedValueOnce([]);

    const result = await broadcast(1, { title: "Test", message: "Hello world!", role_ids: [1] });

    expect(result).toEqual(MOCK_NOTIFICATION);
  });
});

describe("getNotifications", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns notifications and unreadCount for user", async () => {
    vi.mocked(repo.findNotificationsForUser).mockResolvedValueOnce({
      notifications: [MOCK_ITEM],
      unreadCount: 1,
    });

    const result = await getNotifications(1);

    expect(repo.findNotificationsForUser).toHaveBeenCalledWith(1);
    expect(result.data).toHaveLength(1);
    expect(result.meta.unread_count).toBe(1);
  });

  it("returns empty data with unreadCount 0 when no notifications", async () => {
    vi.mocked(repo.findNotificationsForUser).mockResolvedValueOnce({
      notifications: [],
      unreadCount: 0,
    });

    const result = await getNotifications(1);

    expect(result.data).toHaveLength(0);
    expect(result.meta.unread_count).toBe(0);
  });
});

describe("markNotificationAsRead", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls repository markAsRead with correct args", async () => {
    vi.mocked(repo.markAsRead).mockResolvedValueOnce(undefined);

    await markNotificationAsRead(1, 5);

    expect(repo.markAsRead).toHaveBeenCalledWith(1, 5);
  });
});

describe("markAllNotificationsAsRead", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls repository markAllAsRead with userId", async () => {
    vi.mocked(repo.markAllAsRead).mockResolvedValueOnce(undefined);

    await markAllNotificationsAsRead(3);

    expect(repo.markAllAsRead).toHaveBeenCalledWith(3);
  });
});
