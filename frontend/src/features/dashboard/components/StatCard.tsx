import type { ReactNode } from 'react'
import { Spinner } from '@/shared/components/ui'

interface StatCardProps {
  label: string
  value: number
  delta?: string
  sub?: string
  icon: ReactNode
  tone?: 'primary' | 'muted'
  isLoading?: boolean
}

export function StatCard({ label, value, delta, sub, icon, tone = 'muted', isLoading }: StatCardProps) {
  const iconBg = tone === 'primary'
    ? 'bg-primary/10 text-primary'
    : 'bg-muted text-muted-foreground'

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-[18px] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-muted-foreground">{label}</span>
        <span className={`w-7 h-7 rounded-lg inline-flex items-center justify-center ${iconBg}`}>
          {icon}
        </span>
      </div>

      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <div className="text-[30px] font-semibold leading-none tracking-tight">
          {value.toLocaleString()}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{sub}</span>
        {delta && (
          <span className="font-mono">{delta}</span>
        )}
      </div>
    </div>
  )
}
