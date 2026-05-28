"use client";

import { usePathname } from "next/navigation";
import { ROUTE_LABELS } from "./Breadcrumb.constants";

export function useBreadcrumb(): string {
  const pathname = usePathname();
  return ROUTE_LABELS[pathname] ?? "—";
}
