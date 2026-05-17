'use client'

import { ReactNode } from 'react'
import { usePermission } from '@/hooks/usePermission'

interface PermissionGateProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const hasPermission = usePermission(permission)
  return <>{hasPermission ? children : fallback}</>
}
