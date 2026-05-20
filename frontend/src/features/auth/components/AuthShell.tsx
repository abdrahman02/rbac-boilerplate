import type { ReactNode } from 'react'
import { AuthAside } from './AuthAside'
import { BrandMark } from '@/shared/components/common'

interface AuthShellProps {
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({ children, footer }: AuthShellProps) {
  return (
    <div className="auth-grid min-h-screen grid grid-cols-2 bg-background text-foreground">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">
          <BrandMark />
          <div className="animate-fade-in">{children}</div>
          {footer && (
            <p className="mt-6 text-[13.5px] text-muted-foreground text-center">
              {footer}
            </p>
          )}
        </div>
      </div>
      <AuthAside />
    </div>
  )
}
