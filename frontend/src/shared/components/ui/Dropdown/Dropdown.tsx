"use client";

import { FloatingPortal, type Placement } from "@floating-ui/react";
import type { ReactNode } from "react";
import { useDropdown } from "./useDropdown";

interface DropdownProps {
  /** Elemen pemicu — bisa ReactNode atau fungsi (open: boolean) => ReactNode */
  trigger: ReactNode | ((open: boolean) => ReactNode);
  /** Konten dropdown yang akan ditampilkan */
  children: ReactNode;
  /** Posisi dropdown relatif terhadap trigger */
  placement?: Placement;
  /** Jarak antara trigger dan dropdown dalam piksel */
  offsetPx?: number;
}

/**
 * Komponen Dropdown generik menggunakan @floating-ui/react.
 * Mendukung keyboard navigation, dismissal otomatis, dan portal rendering.
 */
export function Dropdown({ trigger, children, placement = "bottom-end", offsetPx = 6 }: DropdownProps) {
  const { open, refs, floatingStyles, getReferenceProps, getFloatingProps } = useDropdown({ placement, offsetPx });

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className="inline-flex">
        {typeof trigger === "function" ? trigger(open) : trigger}
      </div>
      {open && (
        <FloatingPortal>
          <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className="z-50">
            {children}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
