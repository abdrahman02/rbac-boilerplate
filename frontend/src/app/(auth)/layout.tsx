import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Minimal auth route group layout.
 * Visual layout is handled by AuthShell inside each form component.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return <>{children}</>;
}
