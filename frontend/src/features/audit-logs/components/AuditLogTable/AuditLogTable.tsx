"use client";

import { ScrollText } from "lucide-react";
import { memo } from "react";
import type { VariantProps } from "tailwind-variants";
import { TableCell, TableEmptyRow, TableHeader, TableLoadingRow, TableRow, TableShell } from "@/shared/components/ui";
import { Avatar } from "@/shared/components/ui/Avatar";
import { Badge } from "@/shared/components/ui/Badge";
import type { badgeVariants } from "@/shared/components/ui/Badge/Badge.variants";
import { formatDateTime, formatRelative } from "@/shared/lib/format-date";
import type { AuditLog } from "@/shared/types";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

function getActionTone(action: string): BadgeVariant {
  if (action.startsWith("delete_") || action.startsWith("remove_")) return "danger";
  if (action.startsWith("create_") || action === "register") return "success";
  if (action.startsWith("update_") || action.startsWith("sync_") || action.startsWith("assign_")) return "warning";
  if (action === "login" || action === "logout") return "info";
  return "default";
}

interface AuditLogTableProps {
  logs: AuditLog[];
  isFetching: boolean;
  isError?: boolean;
}

export const AuditLogTable = memo(function AuditLogTable({ logs, isFetching, isError }: AuditLogTableProps) {
  return (
    <TableShell>
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <TableHeader>User</TableHeader>
            <TableHeader>Action</TableHeader>
            <TableHeader>Resource</TableHeader>
            <TableHeader>IP Address</TableHeader>
            <TableHeader className="text-right">When</TableHeader>
          </tr>
        </thead>
        <tbody>
          <TableLoadingRow isLoading={isFetching} colSpan={5} />
          {isError && !isFetching && (
            <tr>
              <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                Failed to load audit logs. Try refreshing.
              </td>
            </tr>
          )}
          <TableEmptyRow
            isEmpty={!isFetching && !isError && logs.length === 0}
            colSpan={5}
            icon={<ScrollText size={24} strokeWidth={1.5} aria-hidden />}
            title="No matching events"
            description="Try clearing the search or filters to see all audit logs."
          />
          {logs.map((log) => (
            <AuditLogRow key={log.id} log={log} />
          ))}
        </tbody>
      </table>
    </TableShell>
  );
});

interface AuditLogRowProps {
  log: AuditLog;
}

const AuditLogRow = memo(function AuditLogRow({ log }: AuditLogRowProps) {
  return (
    <TableRow>
      <TableCell>
        {log.userName ? (
          <div className="flex items-center gap-2.5">
            <Avatar name={log.userName} size={28} />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold leading-tight">{log.userName}</span>
              <span className="text-[12px] text-muted-foreground leading-tight">{log.userEmail}</span>
            </div>
          </div>
        ) : (
          <span className="text-[13px] text-muted-foreground">Unknown</span>
        )}
      </TableCell>

      <TableCell>
        <Badge variant={getActionTone(log.action)} dot>
          {log.action}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium">{log.resourceType}</span>
          {log.resourceId !== null && (
            <span className="font-mono text-[11.5px] text-muted-foreground">#{log.resourceId}</span>
          )}
        </div>
      </TableCell>

      <TableCell>
        <span className="font-mono text-[12.5px] text-muted-foreground">{log.ipAddress ?? "—"}</span>
      </TableCell>

      <TableCell className="text-right">
        <span
          title={formatDateTime(log.createdAt)}
          className="text-[12.5px] text-muted-foreground cursor-help underline decoration-dotted underline-offset-2"
        >
          {formatRelative(log.createdAt)}
        </span>
      </TableCell>
    </TableRow>
  );
});
