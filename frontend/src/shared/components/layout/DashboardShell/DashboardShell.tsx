'use client'

import type { ReactNode } from 'react'
import { Sidebar } from '../Sidebar'
import { Header } from '../Header'
import { useSidebar } from '@/shared/hooks/useSidebar'

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { collapsed, mobileOpen, toggleCollapsed, openMobile, closeMobile } = useSidebar()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 animate-fade-in md:hidden">
          <div
            className="absolute inset-0 bg-black/45"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 bottom-0 w-[280px]">
            <Sidebar onMobileClose={closeMobile} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header
          onToggleSidebar={toggleCollapsed}
          onOpenMobileNav={openMobile}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
