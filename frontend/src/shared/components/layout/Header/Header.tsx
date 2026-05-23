'use client'

import { Menu } from 'lucide-react'
import { Breadcrumb } from './Breadcrumb'
import { AvatarMenu } from './AvatarMenu'

interface HeaderProps {
  onToggleSidebar: () => void
  onOpenMobileNav: () => void
}

export function Header({ onToggleSidebar, onOpenMobileNav }: HeaderProps) {
  return (
    <header className="h-16 px-6 border-b border-border bg-background flex items-center gap-4 sticky top-0 z-30 shrink-0">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Desktop: toggle sidebar collapse */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-lg text-foreground hover:bg-muted transition-colors border-0 bg-transparent cursor-pointer"
        >
          <Menu size={18} />
        </button>

        {/* Mobile: open drawer */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="inline-flex md:hidden items-center justify-center w-8 h-8 rounded-lg text-foreground hover:bg-muted transition-colors border-0 bg-transparent cursor-pointer"
        >
          <Menu size={18} />
        </button>

        <Breadcrumb />
      </div>

      {/* Right: avatar */}
      <div className="flex items-center gap-1.5">
        <div className="w-px h-[22px] bg-border mx-1.5" />
        <AvatarMenu />
      </div>
    </header>
  )
}
