"use client";
import { memo } from "react";
import { Button } from "@/shared/components/ui/Button";
import { formatRelative } from "@/shared/lib/format-date";
import { useMarkAsRead } from "../../hooks";
import type { Notification } from "../../types";
import { notificationItem } from "./NotificationItem.variants";

interface NotificationItemProps {
  notification: Notification;
  onReadMore: (notification: Notification) => void;
}

export const NotificationItem = memo(function NotificationItem({ notification, onReadMore }: NotificationItemProps) {
  const markAsRead = useMarkAsRead();

  function handleReadMore(): void {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    onReadMore(notification);
  }

  return (
    <div className={notificationItem({ read: notification.is_read })}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {!notification.is_read && (
            <span className="size-1.5 rounded-full bg-primary shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <span className="text-sm font-medium text-foreground truncate">{notification.title}</span>
        </div>
        <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
          {formatRelative(notification.created_at)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 pl-3">{notification.message}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReadMore}
        className="text-xs text-primary underline-offset-2 hover:underline h-auto p-0 pl-3 font-normal"
      >
        baca selengkapnya
      </Button>
    </div>
  );
});
