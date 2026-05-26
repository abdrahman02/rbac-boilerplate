import { tv } from "tailwind-variants";

export const filterTrigger = tv({
  base: "h-[38px] px-3.5 flex items-center gap-2 rounded-lg text-sm font-medium border transition-colors",
  variants: {
    active: {
      true: "bg-accent text-accent-foreground border-accent-foreground/25",
      false: "bg-background text-foreground border-input hover:bg-muted",
    },
    open: {
      true: "ring-2 ring-ring/20 border-ring",
    },
  },
  defaultVariants: { active: false },
});