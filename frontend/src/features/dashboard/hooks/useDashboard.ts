"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { apiClient } from "@/shared/lib/api-client";
import type { DashboardStats } from "@/shared/types";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get("/dashboard/stats");
      return res.data.data;
    },
  });
}

export function useExportDashboard() {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await apiClient.get<Blob>("/dashboard/export", { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toISOString().slice(11, 19).replace(/:/g, "-");
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `rbac-report-${dateStr}-${timeStr}.xlsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    },
  });
  const exportDashboard = useCallback(() => mutate(), [mutate]);
  return { exportDashboard, isExporting: isPending };
}
