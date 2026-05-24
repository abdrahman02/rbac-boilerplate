'use client'

import { User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { Button } from '@/shared/components/ui/Button'
import { Dropdown } from '@/shared/components/ui/Dropdown'

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

export function AvatarMenu() {
  const { user } = useAuth()
  const logout = useLogout()

  const name = user?.name ?? 'User'
  const email = user?.email ?? ''
  const initials = getInitials(name)

  const trigger = (
    <Button
      type="button"
      variant="ghost"
      size="iconOnly"
      aria-label="Account menu"
      className="rounded-full p-0.5"
    >
      <div className="w-8 h-8 p-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[13px] font-semibold select-none">
        {initials}
      </div>
    </Button>
  )

  return (
    <Dropdown trigger={trigger}>
      <div className="w-60 bg-popover text-popover-foreground border border-border rounded-xl shadow-md animate-scale-in overflow-hidden">
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
