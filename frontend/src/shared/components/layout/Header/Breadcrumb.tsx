"use client";

import { ChevronRight } from "lucide-react";
import { memo } from "react";
import { useBreadcrumb } from "./useBreadcrumb";

export const Breadcrumb = memo(function Breadcrumb() {
  const label = useBreadcrumb();

  return (
    <nav className="flex items-center gap-1.5 text-sm min-w-0" aria-label="Breadcrumb">
      <span className="text-muted-foreground shrink-0">RBAC</span>
      <ChevronRight size={14} className="text-muted-foreground shrink-0" />
      <span className="font-semibold tracking-[-0.005em] truncate">{label}</span>
    </nav>
  );
});
