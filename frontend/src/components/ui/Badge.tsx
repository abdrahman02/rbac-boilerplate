import type { ComponentPropsWithoutRef } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { badge } from '@/shared/lib/variants'

type BadgeProps = ComponentPropsWithoutRef<'span'> & VariantProps<typeof badge>

export function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span className={badge({ variant, className })} {...props}>
      {children}
    </span>
  )
}
