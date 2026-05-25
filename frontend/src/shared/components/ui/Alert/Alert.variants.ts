import { tv } from "tailwind-variants";

export const alertVariants = tv({
  base: "flex gap-2.5 items-start rounded-lg border text-sm",
  variants: {
    variant: {
      destructive: "bg-destructive/8 border-destructive/25 text-destructive p-[10px_12px]",
      success: "bg-success/8 border-success/25 text-success p-[10px_12px]",
    },
  },
  defaultVariants: { variant: "destructive" },
});
