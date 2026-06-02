import { tv } from "tailwind-variants";

export const notificationItem = tv({
  base: "flex flex-col gap-1.5 px-4 py-3 border-l-2 transition-colors",
  variants: {
    read: {
      false: "border-l-primary bg-primary/[.04] hover:bg-primary/[.07]",
      true: "border-l-transparent bg-popover hover:bg-muted/60",
    },
  },
  defaultVariants: { read: false },
});
