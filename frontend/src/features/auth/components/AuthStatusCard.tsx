import type { ReactNode } from "react";
import { StatusBadge } from "./StatusBadge";

interface AuthStatusCardProps {
  variant: "success" | "destructive";
  icon: ReactNode;
  title: string;
  description: ReactNode;
  children?: ReactNode;
}

export function AuthStatusCard({ variant, icon, title, description, children }: AuthStatusCardProps) {
  return (
    <div className="animate-scale-in mt-3">
      <h1 className="text-2xl font-semibold tracking-tight m-0 inline-flex items-center gap-2">
        <StatusBadge variant={variant} icon={icon} />
        {title}
      </h1>
      <p className="mt-2 mb-6 text-sm text-muted-foreground leading-relaxed">{description}</p>
      {children}
    </div>
  );
}
