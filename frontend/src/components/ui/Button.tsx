'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { button } from '@/lib/variants'
import { Spinner } from './Spinner'

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof button> & {
    isLoading?: boolean
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, fullWidth, isLoading, disabled, children, className, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={button({ variant, size, fullWidth, className })}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Spinner size="sm" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  ),
)

Button.displayName = 'Button'
