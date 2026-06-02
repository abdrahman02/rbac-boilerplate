import { describe, expect, it } from "vitest";
import { notificationItem } from "./NotificationItem.variants";

describe("notificationItem", () => {
  it("applies unread styles by default", () => {
    const cls = notificationItem();
    expect(cls).toContain("border-l-primary");
  });

  it("applies read styles when read=true", () => {
    const cls = notificationItem({ read: true });
    expect(cls).toContain("border-l-transparent");
    expect(cls).toContain("bg-popover");
  });

  it("applies unread background when read=false", () => {
    const cls = notificationItem({ read: false });
    expect(cls).toContain("bg-primary");
  });
});
