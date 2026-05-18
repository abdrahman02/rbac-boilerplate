import { tv } from 'tailwind-variants'

export const inputVariants = tv({
  base: 'flex w-full rounded border bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    state: {
      default: 'border-gray-300 focus:ring-primary-500',
      error:   'border-red-500 focus:ring-red-500',
    },
  },
  defaultVariants: { state: 'default' },
})
