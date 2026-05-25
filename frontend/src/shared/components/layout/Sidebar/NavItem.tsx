"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { navItemVariants, navBadgeVariants } from "./NavItem.variants";

interface NavItemProps {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
  collapsed?: boolean;
  onClick?: () => void;
}

export function NavItem({ href, label, icon, badge, collapsed = false, onClick }: NavItemProps) {
  const pathname = usePathname();
  const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={navItemVariants({ active, collapsed })}
      onClick={onClick}
    >
      <span className="flex shrink-0">{icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{label}</span>
          {badge != null && <span className={navBadgeVariants({ active })}>{badge}</span>}
        </>
      )}
    </Link>
  );
}
