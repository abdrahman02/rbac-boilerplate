import { FileText, Key, LayoutDashboard, Shield, ShieldCheck, Users } from "lucide-react";
import type { NavEntry } from "./Sidebar.types";

export const NAV_CONFIG: NavEntry[] = [
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
