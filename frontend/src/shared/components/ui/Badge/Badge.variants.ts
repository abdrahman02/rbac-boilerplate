import { tv } from 'tailwind-variants'

export const badgeVariants = tv({
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  variants: {
    variant: {
      default: 'bg-muted text-muted-foreground',
      success: 'bg-success/15 text-success',
      danger:  'bg-destructive/15 text-destructive',
      warning: 'bg-warning/15 text-warning',
      info:    'bg-accent text-accent-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
})
