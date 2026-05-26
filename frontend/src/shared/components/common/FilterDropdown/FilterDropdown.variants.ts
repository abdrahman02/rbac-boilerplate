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

export const filterBadge = tv({
  base: "min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-[11px] font-semibold",
});

export const filterChevron = tv({
  base: "text-muted-foreground transition-transform",
  variants: {
    open: {
      true: "rotate-180",
      false: "",
    },
  },
  defaultVariants: { open: false },
});

export const filterPanel = tv({
  base: "w-72 bg-popover border border-border rounded-xl shadow-lg animate-scale-in",
});

export const filterPanelHeader = tv({
  base: "flex items-center justify-between px-3.5 py-3 border-b border-border",
});

export const filterPanelBody = tv({
  base: "p-3.5 flex flex-col gap-3.5",
});

export const filterClearBtn = tv({
  base: "text-[12.5px] text-primary font-medium hover:underline h-auto px-0 py-0 font-medium",
});
