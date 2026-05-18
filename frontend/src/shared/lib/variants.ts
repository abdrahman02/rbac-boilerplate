import { tv } from 'tailwind-variants'

export const button = tv({
  base: 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      primary:   'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
      danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost:     'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-6 text-base',
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

export const input = tv({
  base: 'flex w-full rounded border bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    state: {
      default: 'border-gray-300 focus:ring-primary-500',
      error:   'border-red-500 focus:ring-red-500',
    },
  },
  defaultVariants: { state: 'default' },
})

export const badge = tv({
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

export const buttonVariants = button
export const inputVariants = input
