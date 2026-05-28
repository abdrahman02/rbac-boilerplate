"use client";

import type { ReactNode } from "react";
import { memo } from "react";
import { BrandMark } from "@/shared/components/common";
import { PermissionGate } from "@/shared/components/guard";
import { NavGroupWrapper } from "./NavGroupWrapper";
import { NavItem } from "./NavItem";
import { NAV_CONFIG } from "./Sidebar.constants";
import { isNavGroup } from "./Sidebar.types";
import { sidebarVariants } from "./Sidebar.variants";

interface SidebarProps {
  collapsed?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = memo(function Sidebar({ collapsed = false, onMobileClose }: SidebarProps) {
  return (
    <aside className={sidebarVariants({ collapsed })}>
      {/* Brand */}
      <div
        className={`flex items-center h-16 border-b border-sidebar-border shrink-0 ${
          collapsed ? "justify-center px-3" : "px-[18px]"
        }`}
      >
        <BrandMark collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {!collapsed && (
          <div className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-muted-foreground px-2.5 py-2">
            Workspace
          </div>
        )}
        {NAV_CONFIG.map((entry) => {
          if (isNavGroup(entry)) {
            return (
              <NavGroupWrapper key={entry.label} entry={entry} collapsed={collapsed} onMobileClose={onMobileClose} />
            );
          }
          return entry.permission !== null ? (
            <PermissionGate key={entry.href} permission={entry.permission}>
              <NavItem
                href={entry.href}
                label={entry.label}
                icon={entry.icon as ReactNode}
                collapsed={collapsed}
                onClick={onMobileClose}
              />
            </PermissionGate>
          ) : (
            <NavItem
              key={entry.href}
              href={entry.href}
              label={entry.label}
              icon={entry.icon as ReactNode}
              collapsed={collapsed}
              onClick={onMobileClose}
            />
          );
        })}
      </nav>
    </aside>
  );
});
