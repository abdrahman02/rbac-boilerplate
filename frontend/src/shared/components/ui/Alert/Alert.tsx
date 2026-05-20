import type { VariantProps } from 'tailwind-variants'
import { alertVariants } from './Alert.variants'

interface AlertProps extends VariantProps<typeof alertVariants> {
  message: string
  className?: string
}

export function Alert({ message, variant, className }: AlertProps) {
  return (
    <div role="alert" className={alertVariants({ variant, className })}>
      <svg
        className="mt-px shrink-0"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 2L14 13H2L8 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M8 6V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r="0.75" fill="currentColor" />
      </svg>
      <span>{message}</span>
    </div>
  )
}
