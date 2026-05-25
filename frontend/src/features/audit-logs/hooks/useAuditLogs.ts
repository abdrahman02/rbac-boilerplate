"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import type { AuditLog, PaginatedResponse } from "@/shared/types";

interface AuditLogFilters {
  userId?: number;
  action?: string;
  resourceType?: string;
  page?: number;
  limit?: number;
}

export function useAuditLogs(filters: AuditLogFilters = {}) {
  const { page = 1, limit = 20, ...rest } = filters;

  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (rest.userId) params.set("userId", String(rest.userId));
  if (rest.action) params.set("action", rest.action);
  if (rest.resourceType) params.set("resourceType", rest.resourceType);

  return useQuery<PaginatedResponse<AuditLog>>({
    queryKey: ["audit-logs", filters],
    queryFn: async () => {
      const res = await apiClient.get(`/audit-logs?${params.toString()}`);
      return res.data;
    },
  });
}
