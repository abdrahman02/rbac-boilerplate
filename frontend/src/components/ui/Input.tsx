'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { input } from '@/shared/lib/variants'

type InputProps = ComponentPropsWithoutRef<'input'> & {
  error?: string | boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => (
    <input
      ref={ref}
      className={input({ state: error ? 'error' : 'default', className })}
      {...props}
    />
  ),
)

Input.displayName = 'Input'
