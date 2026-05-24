import Link from 'next/link'
import { Users, Shield, Key, ScrollText, ChevronRight } from 'lucide-react'

interface QuickAction {
  icon: typeof Users
  label: string
  href: string
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: Users,      label: 'Invite a user',     href: '/users' },
  { icon: Shield,     label: 'Create a role',     href: '/roles' },
  { icon: Key,        label: 'Add a permission',  href: '/permissions' },
  { icon: ScrollText, label: 'Review audit log',  href: '/audit-logs' },
]

export function QuickActions() {
  return (
    <div className="flex flex-col gap-1.5">
      {QUICK_ACTIONS.map(({ icon: Icon, label, href }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted text-foreground text-[13px] font-medium transition-colors hover:bg-accent hover:text-accent-foreground group"
        >
          <span className="text-primary flex">
            <Icon size={16} />
          </span>
          <span className="flex-1">{label}</span>
          <ChevronRight size={15} className="text-muted-foreground group-hover:text-accent-foreground transition-colors" />
        </Link>
      ))}
    </div>
  )
}
