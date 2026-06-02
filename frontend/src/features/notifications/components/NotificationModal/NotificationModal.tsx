"use client";

import { Button, Modal } from "@/shared/components/ui";
import { formatDateTime } from "@/shared/lib/format-date";
import type { Notification } from "../../types";

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
}

export function NotificationModal({ notification, onClose }: NotificationModalProps) {
  if (!notification) return null;

  return (
    <Modal isOpen={!!notification} onClose={onClose} title={notification.title} maxWidth="md">
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <span className="text-xs text-muted-foreground">
            Dari: <span className="font-medium text-foreground">{notification.creator_name}</span>
          </span>
          <span className="text-xs text-muted-foreground">{formatDateTime(notification.created_at)}</span>
        </div>

        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{notification.message}</p>

        <div className="flex justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
