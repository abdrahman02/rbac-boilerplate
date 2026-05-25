import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "tailwind-variants";
import { badgeVariants } from "./Badge.variants";

type BadgeProps = ComponentPropsWithoutRef<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span className={badgeVariants({ variant, className })} {...props}>
      {children}
    </span>
  );
}
