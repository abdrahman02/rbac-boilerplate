import { tv } from 'tailwind-variants'

export const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 cursor-pointer disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      primary:   'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline:   'border border-border bg-background text-foreground hover:bg-muted',
      danger:    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      ghost:     'text-foreground hover:bg-muted',
    },
    size: {
      sm:       'h-8 px-3 text-sm',
      md:       'h-10 px-4 text-sm',
      lg:       'h-[42px] px-6 text-base',
      iconOnly: 'w-8 h-8 p-0',
    },
    fullWidth: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})
