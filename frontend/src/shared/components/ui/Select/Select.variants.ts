import { tv } from "tailwind-variants";

export const selectRoot = tv({
  base: "relative w-full",
});

export const selectTrigger = tv({
  base: "w-full h-9 pl-3 pr-8 relative flex items-center text-left rounded-lg border border-input bg-background text-sm transition-colors cursor-pointer hover:bg-muted/50",
  variants: {
    hasValue: {
      true: "text-foreground",
      false: "text-muted-foreground",
    },
  },
  defaultVariants: { hasValue: false },
});

export const selectOptionAll = tv({
  base: "w-full text-left px-3 py-1.5 text-[13px] hover:bg-muted transition-colors flex items-center gap-2",
  variants: {
    selected: {
      true: "text-primary font-medium",
      false: "text-muted-foreground",
    },
  },
  defaultVariants: { selected: false },
});

export const selectOptionItem = tv({
  base: "w-full text-left px-3 py-1.5 text-[13px] hover:bg-muted transition-colors flex items-center gap-2",
  variants: {
    selected: {
      true: "text-primary font-medium",
      false: "text-foreground",
    },
  },
  defaultVariants: { selected: false },
});
