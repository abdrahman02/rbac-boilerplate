import { tv } from "tailwind-variants";

export const inputVariants = tv({
  base: "w-full rounded-lg border bg-background text-foreground text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed",
  variants: {
    state: {
      default: "border-input",
      error: "border-destructive focus:ring-destructive",
    },
    hasIconLeft: {
      true: "pl-[38px]",
      false: "pl-3",
    },
    hasIconRight: {
      true: "pr-[38px]",
      false: "pr-3",
    },
    height: {
      sm: "h-9",
      md: "h-[38px]",
      lg: "h-10",
    },
  },
  defaultVariants: {
    state: "default",
    hasIconLeft: false,
    hasIconRight: false,
    height: "md",
  },
});
