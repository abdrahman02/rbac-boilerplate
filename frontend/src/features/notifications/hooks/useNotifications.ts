"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { getErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";
import type { BroadcastPayload, NotificationsApiResponse } from "../types";

export function useNotifications() {
  return useQuery<NotificationsApiResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await apiClient.get<NotificationsApiResponse>("/notifications");
      return res.data;
    },
  });
}

export function useBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BroadcastPayload) => {
      const res = await apiClient.post("/notifications/broadcast", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Broadcast terkirim", {
        description: "Notifikasi berhasil dikirim ke role yang dipilih.",
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err) => toast.error("Gagal mengirim broadcast", { description: getErrorMessage(err) }),
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: number) => {
      await apiClient.patch(`/notifications/${notificationId}/read`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    onError: (err) => toast.error("Gagal menandai notifikasi", { description: getErrorMessage(err) }),
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.patch("/notifications/read-all");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    onError: (err) => toast.error("Gagal menandai semua notifikasi", { description: getErrorMessage(err) }),
  });
}
