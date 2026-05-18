'use client'

import Link from 'next/link'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { PermissionGate } from '@/components/guard/PermissionGate'
import { Button, buttonVariants } from '@/components/ui'

export function NavMenu() {
  const { user, isAuthenticated } = useAuth()
  const logout = useLogout()

  if (!isAuthenticated) return null

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">RBAC Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              Dashboard
            </Link>
            <Link href="/profile" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              Profile
            </Link>
            <PermissionGate permission="users:read">
              <Link href="/users" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                Users
              </Link>
            </PermissionGate>
            <PermissionGate permission="roles:read">
              <Link href="/roles" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                Roles
              </Link>
            </PermissionGate>
            <PermissionGate permission="permissions:read">
              <Link href="/permissions" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                Permissions
              </Link>
            </PermissionGate>
            <PermissionGate permission="audit_logs:read">
              <Link href="/audit-logs" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                Audit Logs
              </Link>
            </PermissionGate>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <Button variant="secondary" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
