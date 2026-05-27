import { Activity, Key, Shield, Users } from "lucide-react";

export const STAT_ICONS = {
  users: <Users size={16} />,
  roles: <Shield size={16} />,
  permissions: <Key size={16} />,
  events: <Activity size={16} />,
} as const;
