import { tv } from "tailwind-variants";

export const permissionLabel = tv({
  base: "flex items-start gap-3 p-3 rounded-lg border-[1.5px] cursor-pointer transition-colors",
  variants: {
    checked: {
      true: "border-primary bg-primary/[.05]",
      false: "border-border bg-background hover:border-border/60",
    },
  },
  defaultVariants: { checked: false },
});
