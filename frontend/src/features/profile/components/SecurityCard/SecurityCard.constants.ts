import { Lock, ShieldCheck } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export interface SecurityItem {
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  label: string;
  value: string;
  cta: string;
}

export const SECURITY_ITEMS: SecurityItem[] = [
  { icon: Lock, label: "Password", value: "Change your password", cta: "Change" },
  { icon: ShieldCheck, label: "Two-factor auth", value: "Authenticator app", cta: "Manage" },
];
