import { tv } from 'tailwind-variants'

export const badgeVariants = tv({
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  variants: {
    variant: {
      default: 'bg-gray-100 text-gray-700',
      success: 'bg-green-100 text-green-700',
      danger:  'bg-red-100 text-red-700',
      warning: 'bg-yellow-100 text-yellow-700',
    },
  },
  defaultVariants: { variant: 'default' },
})
