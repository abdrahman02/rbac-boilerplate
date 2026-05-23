'use client'

import { useState, type ReactNode } from 'react'
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  offset,
  flip,
  shift,
  type Placement,
} from '@floating-ui/react'

interface DropdownProps {
  /** Elemen pemicu yang diklik untuk membuka dropdown */
  trigger: ReactNode
  /** Konten dropdown yang akan ditampilkan */
  children: ReactNode
  /** Posisi dropdown relatif terhadap trigger */
  placement?: Placement
  /** Jarak antara trigger dan dropdown dalam piksel */
  offsetPx?: number
}

/**
 * Komponen Dropdown generik menggunakan @floating-ui/react.
 * Mendukung keyboard navigation, dismissal otomatis, dan portal rendering.
 */
export function Dropdown({
  trigger,
  children,
  placement = 'bottom-end',
  offsetPx = 6,
}: DropdownProps) {
  const [open, setOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(offsetPx), flip(), shift({ padding: 8 })],
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className="inline-flex">
        {trigger}
      </div>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50"
          >
            {children}
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
