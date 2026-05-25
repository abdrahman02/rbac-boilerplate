"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Breadcrumb } from "./Breadcrumb";
import { AvatarMenu } from "./AvatarMenu";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export function Header({ onToggleSidebar, onOpenMobileNav, isDark, onToggleDark }: HeaderProps) {
  return (
    <header className="h-16 px-6 border-b border-border bg-background flex items-center gap-4 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="iconOnly"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="hidden md:inline-flex"
        >
          <Menu size={18} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="iconOnly"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="md:hidden"
        >
          <Menu size={18} />
        </Button>
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="iconOnly"
          onClick={onToggleDark}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </Button>
        <div className="w-px h-[22px] bg-border mx-1.5" />
        <AvatarMenu />
      </div>
    </header>
  );
}
