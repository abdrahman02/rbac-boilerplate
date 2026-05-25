import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "tailwind-variants";
import { badgeVariants } from "./Badge.variants";

type BadgeProps = ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean;
  };

export function Badge({ variant, className, children, dot, ...props }: BadgeProps) {
  return (
    <span className={badgeVariants({ variant, className })} {...props}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0" />}
      {children}
    </span>
  );
}
