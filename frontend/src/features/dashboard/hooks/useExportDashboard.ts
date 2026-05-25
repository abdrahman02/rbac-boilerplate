"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";

async function downloadExportFile(): Promise<void> {
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
}

export function useExportDashboard(): {
  exportDashboard: () => void;
  isExporting: boolean;
} {
  const { mutate, isPending } = useMutation({ mutationFn: downloadExportFile });
  return { exportDashboard: () => mutate(), isExporting: isPending };
}
