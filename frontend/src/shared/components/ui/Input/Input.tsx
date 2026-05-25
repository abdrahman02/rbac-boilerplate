"use client";

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from "react";
import { inputVariants } from "./Input.variants";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  error?: string | boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  height?: "sm" | "md" | "lg";
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, iconLeft, iconRight, height, className, containerClassName, ...props }, ref) => (
    <div className={`relative flex items-center ${containerClassName ?? ""}`}>
      {iconLeft && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex">
          {iconLeft}
        </span>
      )}
      <input
        ref={ref}
        className={inputVariants({
          state: error ? "error" : "default",
          hasIconLeft: !!iconLeft,
          hasIconRight: !!iconRight,
          height,
          className,
        })}
        {...props}
      />
      {iconRight && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground flex">{iconRight}</span>
      )}
    </div>
  ),
);

Input.displayName = "Input";
