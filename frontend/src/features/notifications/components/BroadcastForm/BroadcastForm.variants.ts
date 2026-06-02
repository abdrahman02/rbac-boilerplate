import { tv } from "tailwind-variants";

export const roleLabel = tv({
  base: "flex items-center gap-3 p-3 rounded-lg border-[1.5px] cursor-pointer transition-colors select-none",
  variants: {
    checked: {
      true: "border-primary bg-primary/[.05] text-foreground",
      false: "border-border bg-background hover:border-border/70 text-foreground",
    },
  },
  defaultVariants: { checked: false },
});
