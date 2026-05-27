import type { ReactNode } from "react";

export interface StatCardConfig {
  label: string;
  value: number;
  delta?: string;
  sub?: string;
  icon: ReactNode;
}

export interface RoleBar {
  id: number;
  name: string;
  count: number;
  pct: number;
}
