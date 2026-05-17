'use client'

import { ReactNode } from 'react'
import { useAuthStore } from '@/stores/authStore'

interface RoleGateProps {
  role: string
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGate({ role, children, fallback = null }: RoleGateProps) {
  const user = useAuthStore((state) => state.user)
  const hasRole = user?.roles?.some((r) => r.name === role) ?? false
  return <>{hasRole ? children : fallback}</>
}
