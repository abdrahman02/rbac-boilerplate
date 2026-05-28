"use client";

import type { ReactNode } from "react";
import { memo } from "react";
import { useAnyPermission } from "@/shared/hooks/useAnyPermission";
import { NavGroup } from "./NavGroup";
import type { NavGroupDef } from "./Sidebar.types";

interface NavGroupWrapperProps {
  entry: NavGroupDef;
  collapsed: boolean;
  onMobileClose?: () => void;
}

export const NavGroupWrapper = memo(function NavGroupWrapper({
  entry,
  collapsed,
  onMobileClose,
}: NavGroupWrapperProps) {
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
});
