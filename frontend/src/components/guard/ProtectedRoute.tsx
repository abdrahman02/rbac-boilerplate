'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const router = useRouter()
  const { isLoading, isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    if (requiredPermission && !user?.permissions?.includes(requiredPermission)) {
      router.replace('/unauthorized')
    }
  }, [isLoading, isAuthenticated, requiredPermission, user, router])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredPermission && !user?.permissions?.includes(requiredPermission)) {
    return null
  }

  return <>{children}</>
}
