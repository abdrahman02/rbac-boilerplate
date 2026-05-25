import type { ReactNode } from "react";
import { ProtectedRoute } from "@/shared/components/guard/ProtectedRoute";
import { DashboardShell } from "@/shared/components/layout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
