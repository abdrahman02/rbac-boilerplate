import { tv } from 'tailwind-variants'

export const navItemVariants = tv({
  base: 'flex items-center gap-2.5 h-[38px] rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer border-0 bg-transparent font-sans w-full',
  variants: {
    active: {
      true:  'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
      false: 'text-sidebar-foreground hover:bg-primary/[0.08] hover:text-foreground dark:hover:text-foreground',
    },
    collapsed: {
      true:  'justify-center px-2.5',
      false: 'justify-start px-2.5',
    },
  },
  defaultVariants: { active: false, collapsed: false },
})

export const navBadgeVariants = tv({
  base: 'min-w-[22px] h-[18px] px-1.5 inline-flex items-center justify-center rounded-full text-[10.5px] font-semibold tabular-nums',
  variants: {
    active: {
      true:  'bg-white/[0.14] text-primary-foreground border border-white/[0.12]',
      false: 'bg-muted text-muted-foreground border border-border',
    },
  },
  defaultVariants: { active: false },
})
