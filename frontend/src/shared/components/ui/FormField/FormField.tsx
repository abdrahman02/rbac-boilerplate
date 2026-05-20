import type { ReactNode } from 'react'

interface FormFieldProps {
  label: ReactNode
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground flex justify-between items-center">
        <span>
          {label}
          {required && <span className="text-destructive ml-0.5" aria-hidden>*</span>}
        </span>
      </label>
      {children}
      {(error ?? hint) && (
        <span className={`text-xs ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
