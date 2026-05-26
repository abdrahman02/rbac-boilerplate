import { tv } from "tailwind-variants";

export const menuItemBase = tv({
  /* overrides Button ghost/md defaults so twMerge resolves correctly */
  base: "w-full flex justify-start h-auto px-2.5 py-2 rounded-md text-[13.5px] font-normal text-left gap-2.5",
  variants: {
    destructive: {
      true: "text-destructive hover:bg-destructive/[.08]",
      false: "text-foreground hover:bg-accent",
    },
  },
  defaultVariants: { destructive: false },
});

export const menuItemIcon = tv({
  base: "flex",
  variants: {
    destructive: {
      true: "text-destructive",
      false: "text-muted-foreground",
    },
  },
  defaultVariants: { destructive: false },
});
