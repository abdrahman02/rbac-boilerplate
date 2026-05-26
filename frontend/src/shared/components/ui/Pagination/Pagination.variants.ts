import { tv } from "tailwind-variants";

export const pageBtnVariants = tv({
  base: "min-w-8 h-8 inline-flex items-center justify-center rounded-md border text-[13px] transition-colors",
  variants: {
    active: {
      true: "bg-primary text-primary-foreground border-primary font-semibold",
      false: "bg-transparent text-foreground border-border hover:bg-muted",
    },
    disabled: {
      true: "opacity-40 cursor-not-allowed",
      false: "cursor-pointer",
    },
    iconOnly: {
      true: "w-8 px-0",
      false: "px-2 font-medium tabular-nums",
    },
  },
  defaultVariants: {
    active: false,
    disabled: false,
    iconOnly: false,
  },
});
