import { tv } from "tailwind-variants";

export const spinnerVariants = tv({
  base: "animate-spin rounded-full border-2 border-current border-t-transparent",
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    },
  },
  defaultVariants: { size: "md" },
});
