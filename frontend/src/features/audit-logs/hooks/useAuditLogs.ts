"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import type { AuditLog, PaginatedResponse } from "@/shared/types";

interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  resourceType?: string;
}

export function useAuditLogs(params: AuditLogQueryParams = {}) {
  const { page = 1, limit = 20, search, action, resourceType } = params;

  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) query.set("search", search);
  if (action) query.set("action", action);
  if (resourceType) query.set("resourceType", resourceType);

  return useQuery<PaginatedResponse<AuditLog>>({
    queryKey: ["audit-logs", params],
    queryFn: async () => {
      const res = await apiClient.get(`/audit-logs?${query.toString()}`);
      return res.data;
    },
  });
}
