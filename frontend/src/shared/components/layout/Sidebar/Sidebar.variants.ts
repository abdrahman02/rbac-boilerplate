import { tv } from 'tailwind-variants'

export const sidebarVariants = tv({
  base: 'flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0 transition-all duration-200 overflow-hidden',
  variants: {
    collapsed: {
      true: 'w-[68px]',
      false: 'w-[240px]',
    },
  },
  defaultVariants: { collapsed: false },
})
