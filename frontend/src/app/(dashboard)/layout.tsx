'use client'

import { ReactNode } from 'react'
import { ProtectedRoute } from '@/shared/components/guard/ProtectedRoute'
import { NavMenu } from '@/shared/components/common/NavMenu'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <NavMenu />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </ProtectedRoute>
  )
}
