'use client'

import type { ReactNode } from 'react'
import { LayoutDashboard, Users, Shield, Key, FileText } from 'lucide-react'
import { NavItem } from './NavItem'
import { sidebarVariants } from './Sidebar.variants'
import { PermissionGate } from '@/shared/components/guard/PermissionGate'

interface NavItemDef {
  href: string
  label: string
  icon: ReactNode
  permission: string | null
}

interface SidebarProps {
  collapsed?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ collapsed = false, onMobileClose }: SidebarProps) {
  const navItems: NavItemDef[] = [
    { href: '/dashboard',   label: 'Dashboard',   icon: <LayoutDashboard size={18} />, permission: null },
    { href: '/users',       label: 'Users',       icon: <Users size={18} />,           permission: 'users:read' },
    { href: '/roles',       label: 'Roles',       icon: <Shield size={18} />,          permission: 'roles:read' },
    { href: '/permissions', label: 'Permissions', icon: <Key size={18} />,             permission: 'permissions:read' },
    { href: '/audit-logs',  label: 'Audit Logs',  icon: <FileText size={18} />,        permission: 'audit_logs:read' },
  ]

  return (
    <aside className={sidebarVariants({ collapsed })}>
      {/* Brand */}
      <div
        className={`flex items-center h-16 border-b border-sidebar-border shrink-0 ${
          collapsed ? 'justify-center px-3' : 'gap-2.5 px-[18px]'
        }`}
      >
        <div
          className="w-8 h-8 rounded-[9px] bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shrink-0"
          style={{ boxShadow: 'inset 0 -1px 0 rgb(255 255 255 / 0.08), 0 1px 2px rgb(0 0 0 / 0.08)' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3 4 6v6c0 4.6 3.2 7.7 8 9 4.8-1.3 8-4.4 8-9V6l-8-3z" />
            <path d="M9 12.5 11 14.5 15.5 10" />
          </svg>
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-[1.1]">
            <span className="text-[14px] font-semibold tracking-[-0.01em]">Bedrock</span>
            <span className="text-[11px] text-muted-foreground">Access Control</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {!collapsed && (
          <div className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-muted-foreground px-2.5 py-2">
            Workspace
          </div>
        )}
        {navItems.map(({ href, label, icon, permission }) =>
          permission !== null ? (
            <PermissionGate key={href} permission={permission}>
              <NavItem
                href={href}
                label={label}
                icon={icon}
                collapsed={collapsed}
                onClick={onMobileClose}
              />
            </PermissionGate>
          ) : (
            <NavItem
              key={href}
              href={href}
              label={label}
              icon={icon}
              collapsed={collapsed}
              onClick={onMobileClose}
            />
          )
        )}
      </nav>
    </aside>
  )
}
