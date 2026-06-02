"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "@/shared/lib/toast";

const SSE_URL = `${process.env.NEXT_PUBLIC_API_URL}/notifications/stream`;

export function useNotificationSSE(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    const es = new EventSource(SSE_URL, { withCredentials: true });

    es.addEventListener("new_notification", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.info("Notifikasi baru", { description: "Ada notifikasi baru untuk Anda." });
    });

    es.onerror = () => {
      // EventSource auto-reconnects natively on error; no manual retry needed
    };

    return () => {
      es.close();
    };
  }, [queryClient]);
}
