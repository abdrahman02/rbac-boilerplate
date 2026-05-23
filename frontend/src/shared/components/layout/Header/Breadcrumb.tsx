'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/roles': 'Roles',
  '/permissions': 'Permissions',
  '/audit-logs': 'Audit Logs',
  '/profile': 'Profile',
}

export function Breadcrumb() {
  const pathname = usePathname()
  const label = ROUTE_LABELS[pathname] ?? '—'

  return (
    <nav className="flex items-center gap-1.5 text-sm min-w-0" aria-label="Breadcrumb">
      <span className="text-muted-foreground shrink-0">Bedrock</span>
      <ChevronRight size={14} className="text-muted-foreground shrink-0" />
      <span className="font-semibold tracking-[-0.005em] truncate">{label}</span>
    </nav>
  )
}
