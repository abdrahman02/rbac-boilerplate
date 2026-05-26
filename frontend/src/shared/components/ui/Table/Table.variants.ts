import { tv } from "tailwind-variants";

export const tableShell = tv({
  base: "rounded-xl border border-border bg-card shadow-sm overflow-hidden",
});

export const tableHeader = tv({
  base: "px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.02em] border-b border-border whitespace-nowrap",
});

export const tableRow = tv({
  base: "border-b border-border hover:bg-muted/50 transition-colors",
});

export const tableCell = tv({
  base: "px-4 py-3",
});
