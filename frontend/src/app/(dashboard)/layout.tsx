'use client'

import { ReactNode } from 'react'
import { ProtectedRoute } from '@/components/guard/ProtectedRoute'
import { NavMenu } from '@/components/common/NavMenu'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <NavMenu />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </ProtectedRoute>
  )
}
