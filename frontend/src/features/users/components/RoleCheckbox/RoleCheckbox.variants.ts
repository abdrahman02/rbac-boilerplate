import { tv } from "tailwind-variants";

export const roleLabel = tv({
  base: "flex items-center gap-3 p-2.5 rounded-lg border-[1.5px] cursor-pointer transition-colors",
  variants: {
    checked: {
      true: "border-primary bg-primary/[.05]",
      false: "border-border bg-background hover:border-border/60",
    },
  },
  defaultVariants: { checked: false },
});
