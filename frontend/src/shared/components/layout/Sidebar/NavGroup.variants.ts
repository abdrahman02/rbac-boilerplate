import { tv } from "tailwind-variants";

export const navGroupTriggerVariants = tv({
  base: "flex items-center gap-2.5 h-[38px] rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer border-0 bg-transparent font-sans w-full",
  variants: {
    activeParent: {
      true: "bg-primary/[0.18] text-primary hover:bg-primary/[0.25] hover:text-primary",
      false: "text-sidebar-foreground hover:bg-primary/[0.08] hover:text-foreground dark:hover:text-foreground",
    },
    collapsed: {
      true: "justify-center px-2.5",
      false: "justify-start px-2.5",
    },
  },
  defaultVariants: { activeParent: false, collapsed: false },
});

export const navGroupChildVariants = tv({
  base: "flex items-center gap-2 h-[34px] rounded-md text-[13px] font-medium transition-colors cursor-pointer pl-3 pr-2.5 w-full",
  variants: {
    active: {
      true: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
      false: "text-sidebar-foreground/70 hover:bg-primary/[0.08] hover:text-foreground dark:hover:text-foreground",
    },
  },
  defaultVariants: { active: false },
});
