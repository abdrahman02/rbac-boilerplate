"use client";

import { cloneElement, forwardRef, isValidElement, type ComponentPropsWithoutRef, type ReactElement } from "react";
import type { VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "./Button.variants";
import { Spinner } from "../Spinner";

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    /** Render children as the root element, merging button variant classes onto it. */
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, fullWidth, isLoading, disabled, children, className, asChild, ...props }, ref) => {
    const computedClass = buttonVariants({ variant, size, fullWidth, className });

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>;
      return cloneElement(child, {
        className: twMerge(computedClass, child.props.className),
      });
    }

    return (
      <button ref={ref} disabled={disabled || isLoading} className={computedClass} {...props}>
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner size="sm" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
