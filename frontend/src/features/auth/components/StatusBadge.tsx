import type { ReactNode } from "react";

interface StatusBadgeProps {
  variant: "success" | "destructive";
  icon: ReactNode;
}

export function StatusBadge({ variant, icon }: StatusBadgeProps) {
  const colorClass =
    variant === "success"
      ? "bg-success/12 text-success border-success/22"
      : "bg-destructive/12 text-destructive border-destructive/22";

  return (
    <div className={`w-6 h-6 rounded-full border inline-flex items-center justify-center ${colorClass}`}>{icon}</div>
  );
}
