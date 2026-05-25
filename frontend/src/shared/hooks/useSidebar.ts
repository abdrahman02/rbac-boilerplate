import { useState, useCallback } from "react";

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

export function useSidebar(): SidebarState {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return { collapsed, mobileOpen, toggleCollapsed, openMobile, closeMobile };
}
