"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { NavItemDef } from "./Sidebar.types";

interface UseNavGroupReturn {
  isOpen: boolean;
  isActiveParent: boolean;
  toggle: () => void;
}

export function useNavGroup(items: NavItemDef[]): UseNavGroupReturn {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActiveParent = items.some((item) => pathname.startsWith(item.href));

  useEffect(() => {
    if (isActiveParent) setIsOpen(true);
  }, [isActiveParent]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, isActiveParent, toggle };
}
