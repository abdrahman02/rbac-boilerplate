import type { ReactNode } from "react";

export interface NavItemDef {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
  permission: string | null;
}

export interface NavGroupDef {
  label: string;
  icon: ReactNode;
  permissions: string[];
  children: NavItemDef[];
}

export type NavEntry = NavItemDef | NavGroupDef;

export function isNavGroup(entry: NavEntry): entry is NavGroupDef {
  return "children" in entry;
}
