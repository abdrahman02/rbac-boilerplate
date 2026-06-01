import { Key, type LucideIcon, ScrollText, Shield, Users } from "lucide-react";

export interface QuickAction {
  icon: LucideIcon;
  label: string;
  href: string;
  permission: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { icon: Users, label: "Invite a user", href: "/users", permission: "users:read" },
  { icon: Shield, label: "Create a role", href: "/roles", permission: "roles:read" },
  { icon: Key, label: "Add a permission", href: "/permissions", permission: "permissions:read" },
  { icon: ScrollText, label: "Review audit log", href: "/audit-logs", permission: "audit_logs:read" },
];
