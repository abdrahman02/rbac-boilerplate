"use client";

import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import type { AuditLogFiltersState } from "../types";
import { useAuditLogs } from "./useAuditLogs";

const PAGE_SIZE = 20;
const EMPTY_FILTER: AuditLogFiltersState = { action: "", resourceType: "" };

export function useAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<AuditLogFiltersState>(EMPTY_FILTER);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError } = useAuditLogs({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    action: filters.action || undefined,
    resourceType: filters.resourceType || undefined,
  });

  const logs = useMemo(() => data?.data ?? [], [data]);
  const total = data?.meta.total ?? 0;
  const isFetching = useIsFetching({ queryKey: ["audit-logs"] }) > 0;

  const activeFilterCount = [filters.action, filters.resourceType].filter(Boolean).length;

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
  }, [queryClient]);

  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const handleFiltersChange = useCallback((f: AuditLogFiltersState) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(EMPTY_FILTER);
    setPage(1);
  }, []);

  return {
    page,
    setPage,
    search,
    filters,
    logs,
    total,
    pageSize: PAGE_SIZE,
    isLoading,
    isError,
    isFetching,
    activeFilterCount,
    clearFilters: activeFilterCount > 0 ? handleClearFilters : undefined,
    handleRefresh,
    handleSearchChange,
    handleFiltersChange,
  };
}
