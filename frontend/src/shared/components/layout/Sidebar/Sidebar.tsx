"use client";

import { FileText, Key, LayoutDashboard, Shield, ShieldCheck, Users } from "lucide-react";
import type { ReactNode } from "react";
import { BrandMark } from "@/shared/components/common/BrandMark";
import { PermissionGate } from "@/shared/components/guard/PermissionGate";
import { useAnyPermission } from "@/shared/hooks/useAnyPermission";
import { NavGroup } from "./NavGroup";
import { NavItem } from "./NavItem";
import type { NavEntry, NavGroupDef } from "./Sidebar.types";
import { isNavGroup } from "./Sidebar.types";
import { sidebarVariants } from "./Sidebar.variants";

const NAV_CONFIG: NavEntry[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, permission: null },
  { href: "/users", label: "Users", icon: <Users size={18} />, permission: "users:read" },
  {
    label: "Access Control",
    icon: <Shield size={18} />,
    permissions: ["roles:read", "permissions:read"],
    children: [
      { href: "/roles", label: "Roles", icon: <ShieldCheck size={18} />, permission: "roles:read" },
      { href: "/permissions", label: "Permissions", icon: <Key size={18} />, permission: "permissions:read" },
    ],
  },
  { href: "/audit-logs", label: "Audit Logs", icon: <FileText size={18} />, permission: "audit_logs:read" },
];

interface SidebarProps {
  collapsed?: boolean;
  onMobileClose?: () => void;
}

interface NavGroupWrapperProps {
  entry: NavGroupDef;
  collapsed: boolean;
  onMobileClose?: () => void;
}

function NavGroupWrapper({ entry, collapsed, onMobileClose }: NavGroupWrapperProps) {
  const visible = useAnyPermission(entry.permissions);
  if (!visible) return null;
  return (
    <NavGroup
      label={entry.label}
      icon={entry.icon as ReactNode}
      items={entry.children}
      collapsed={collapsed}
      onChildClick={onMobileClose}
    />
  );
}

export function Sidebar({ collapsed = false, onMobileClose }: SidebarProps) {
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
}
