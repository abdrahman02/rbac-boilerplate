import { tv } from "tailwind-variants";

// Applied as className on <Button variant="outline"> — only overrides that differ from Button defaults.
// Button base already provides: rounded-lg, transition-colors, font-medium, inline-flex items-center justify-center.
// We override: sizing (h-[38px] px-3.5), layout (flex gap-2 instead of inline-flex justify-center),
// and add active/open state variants.
export const filterTrigger = tv({
  base: "h-[38px] px-3.5 flex gap-2 justify-start",
  variants: {
    active: {
      true: "bg-accent text-accent-foreground border-accent-foreground/25",
      false: "",
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
  base: "text-[12.5px] text-primary font-medium hover:underline h-auto px-0 py-0",
});
