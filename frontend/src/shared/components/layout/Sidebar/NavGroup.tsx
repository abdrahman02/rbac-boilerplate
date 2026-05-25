"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { PermissionGate } from "@/shared/components/guard/PermissionGate";
import { Dropdown } from "@/shared/components/ui/Dropdown";
import { navGroupTriggerVariants, navGroupChildVariants } from "./NavGroup.variants";
import type { NavItemDef } from "./Sidebar.types";

interface NavGroupProps {
  label: string;
  icon: ReactNode;
  items: NavItemDef[];
  collapsed?: boolean;
  onChildClick?: () => void;
}

export function NavGroup({ label, icon, items, collapsed = false, onChildClick }: NavGroupProps) {
  const pathname = usePathname();
  const isActiveParent = items.some((item) => pathname.startsWith(item.href));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (items.some((item) => pathname.startsWith(item.href))) setIsOpen(true);
  }, [pathname, items]);

  const childList = items.map((item) => {
    const active = pathname.startsWith(item.href);
    const className = navGroupChildVariants({ active });

    if (item.permission !== null) {
      return (
        <PermissionGate key={item.href} permission={item.permission}>
          <Link href={item.href} className={className} onClick={onChildClick}>
            <span className="flex shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        </PermissionGate>
      );
    }

    return (
      <Link key={item.href} href={item.href} className={className} onClick={onChildClick}>
        <span className="flex shrink-0">{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    );
  });

  if (collapsed) {
    const trigger = (
      <button
        type="button"
        title={label}
        className={navGroupTriggerVariants({ activeParent: isActiveParent, collapsed: true })}
      >
        <span className="flex shrink-0">{icon}</span>
      </button>
    );
    return (
      <Dropdown trigger={trigger} placement="right-start" offsetPx={8}>
        <div className="bg-popover border border-border rounded-lg shadow-md py-1.5 min-w-[160px]">
          <div className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-muted-foreground px-3 py-1.5">
            {label}
          </div>
          <div className="px-1.5 flex flex-col gap-0.5">{childList}</div>
        </div>
      </Dropdown>
    );
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={navGroupTriggerVariants({ activeParent: isActiveParent, collapsed: false })}
      >
        <span className="flex shrink-0">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown size={14} className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="pl-4 pt-0.5 flex flex-col gap-0.5">{childList}</div>}
    </div>
  );
}
