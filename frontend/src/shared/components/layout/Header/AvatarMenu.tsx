'use client'

import { User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { Dropdown } from '@/shared/components/ui/Dropdown'

/**
 * Extracts up to 2 initials from a full name.
 * Example: "Abdul Rahman" → "AR"
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

/**
 * AvatarMenu — displays the current user's avatar (initials) as a trigger,
 * and opens a dropdown with profile info, a profile link, and a logout button.
 */
export function AvatarMenu() {
  const { user } = useAuth()
  // useLogout returns a plain callback, not a mutation object
  const logout = useLogout()

  const name = user?.name ?? 'User'
  const email = user?.email ?? ''
  const initials = getInitials(name)

  const trigger = (
    <button
      type="button"
      aria-label="Account menu"
      className="inline-flex items-center p-0.5 rounded-full border-0 bg-transparent cursor-pointer"
    >
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[13px] font-semibold select-none">
        {initials}
      </div>
    </button>
  )

  return (
    <Dropdown trigger={trigger}>
      <div className="w-60 bg-popover text-popover-foreground border border-border rounded-xl shadow-md animate-scale-in overflow-hidden">
        {/* User info panel */}
        <div className="flex items-center gap-2.5 px-3 py-3">
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[13px] font-semibold shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold leading-[1.2] truncate">{name}</div>
            <div className="text-xs text-muted-foreground truncate">{email}</div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Profile link */}
        <div className="p-1">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] hover:bg-muted transition-colors"
          >
            <User size={16} className="shrink-0" />
            Profile
          </Link>
        </div>

        <div className="h-px bg-border" />

        {/* Logout button */}
        <div className="p-1">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2.5 px-2.5 py-2 w-full rounded-lg text-[13.5px] text-destructive hover:bg-destructive/10 transition-colors border-0 bg-transparent font-sans cursor-pointer text-left"
          >
            <LogOut size={16} className="shrink-0" />
            Log out
          </button>
        </div>
      </div>
    </Dropdown>
  )
}
