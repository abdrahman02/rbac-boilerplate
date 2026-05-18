'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { buttonVariants } from './Button.variants'
import { Spinner } from '../Spinner'

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, fullWidth, isLoading, disabled, children, className, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={buttonVariants({ variant, size, fullWidth, className })}
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
