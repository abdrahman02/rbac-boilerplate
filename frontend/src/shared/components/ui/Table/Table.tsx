import type { ReactNode } from "react";
import { Spinner } from "@/shared/components/ui";
import { tableCell, tableHeader, tableRow, tableScrollWrapper, tableShell } from "./Table.variants";

interface TableShellProps {
  children: ReactNode;
  className?: string;
}

export function TableShell({ children, className }: TableShellProps) {
  return (
    <div className={tableShell({ className })}>
      <div className={tableScrollWrapper()}>{children}</div>
    </div>
  );
}

interface TableHeaderProps {
  children?: ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return <th className={tableHeader({ className })}>{children}</th>;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className }: TableRowProps) {
  return <tr className={tableRow({ className })}>{children}</tr>;
}

interface TableCellProps {
  children?: ReactNode;
  colSpan?: number;
  className?: string;
}

export function TableCell({ children, colSpan, className }: TableCellProps) {
  return (
    <td colSpan={colSpan} className={tableCell({ className })}>
      {children}
    </td>
  );
}

interface TableLoadingRowProps {
  isLoading: boolean;
  colSpan: number;
}

export function TableLoadingRow({ isLoading, colSpan }: TableLoadingRowProps) {
  if (!isLoading) return null;
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <div className="flex justify-center items-center gap-2.5 text-[13px] text-muted-foreground">
          <Spinner size="sm" />
          <span>Fetching latest data…</span>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface TableEmptyRowProps {
  isEmpty: boolean;
  colSpan: number;
  icon?: ReactNode;
  title?: string;
  description?: string;
}

export function TableEmptyRow({
  isEmpty,
  colSpan,
  icon,
  title = "No results found",
  description = "Try adjusting your filters.",
}: TableEmptyRowProps) {
  if (!isEmpty) return null;
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="flex flex-col items-center gap-3 py-16 px-4 text-center">
          {icon && (
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground">
              {icon}
            </div>
          )}
          <div className="text-[15px] font-semibold">{title}</div>
          <div className="text-[13.5px] text-muted-foreground max-w-sm">{description}</div>
        </div>
      </td>
    </tr>
  );
}
