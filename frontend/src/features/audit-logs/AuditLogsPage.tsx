"use client";

import { PageHeader } from "@/shared/components/common";
import { Pagination } from "@/shared/components/ui";
import { AuditLogTable } from "./components/AuditLogTable";
import { AuditLogToolbar } from "./components/AuditLogToolbar";
import { useAuditLogsPage } from "./hooks";

export function AuditLogsPage() {
  const {
    page,
    setPage,
    search,
    filters,
    logs,
    total,
    pageSize,
    isFetching,
    isError,
    activeFilterCount,
    clearFilters,
    handleRefresh,
    handleSearchChange,
    handleFiltersChange,
  } = useAuditLogsPage();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Audit Logs"
        description="A complete, immutable trail of authentication and authorization events."
      />

      <AuditLogToolbar
        search={search}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        activeFilterCount={activeFilterCount}
        onClearFilters={clearFilters}
        isFetching={isFetching}
        onRefresh={handleRefresh}
      />

      <AuditLogTable logs={logs} isFetching={isFetching} isError={isError} />

      {total > pageSize && (
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} label="events" />
      )}
    </div>
  );
}
