import { type LucideIcon, Key, ScrollText, Shield, Users } from "lucide-react";

export interface QuickAction {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { icon: Users, label: "Invite a user", href: "/users" },
  { icon: Shield, label: "Create a role", href: "/roles" },
  { icon: Key, label: "Add a permission", href: "/permissions" },
  { icon: ScrollText, label: "Review audit log", href: "/audit-logs" },
];
