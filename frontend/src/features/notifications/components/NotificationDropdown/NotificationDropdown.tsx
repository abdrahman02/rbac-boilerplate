"use client";

import { Bell, BellOff } from "lucide-react";
import { useState } from "react";
import { Button, Dropdown } from "@/shared/components/ui";
import { useMarkAllAsRead, useNotifications } from "../../hooks";
import type { Notification } from "../../types";
import { NotificationItem } from "../NotificationItem";
import { NotificationModal } from "../NotificationModal";

export function NotificationDropdown() {
  const { data } = useNotifications();
  const markAllAsRead = useMarkAllAsRead();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const notifications = data?.data ?? [];
  const unreadCount = data?.meta.unread_count ?? 0;

  function handleMarkAllAsRead(): void {
    markAllAsRead.mutate();
  }

  return (
    <>
      <Dropdown
        trigger={(open) => (
          <div className="relative">
            <Button type="button" variant="ghost" size="iconOnly" aria-label="Notifikasi" aria-expanded={open}>
              <Bell size={17} />
            </Button>
            {unreadCount > 0 && (
              <span
                role="status"
                className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold leading-none flex items-center justify-center animate-fade-in"
                aria-label={`${unreadCount} notifikasi belum dibaca`}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        )}
        placement="bottom-end"
      >
        <div className="w-80 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg animate-scale-in overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Notifikasi</span>
            {unreadCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsRead.isPending}
              >
                Tandai semua dibaca
              </Button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
                <BellOff size={20} />
                <span>Belum ada notifikasi</span>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onReadMore={setSelectedNotification} />
              ))
            )}
          </div>
        </div>
      </Dropdown>

      <NotificationModal notification={selectedNotification} onClose={() => setSelectedNotification(null)} />
    </>
  );
}
