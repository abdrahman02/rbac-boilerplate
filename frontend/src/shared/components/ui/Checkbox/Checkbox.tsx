"use client";

import type { ChangeEvent, ComponentPropsWithoutRef } from "react";
import { checkboxVariants } from "./Checkbox.variants";

type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({ onCheckedChange, onChange, className, ...props }: CheckboxProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onCheckedChange?.(e.target.checked);
  };

  return (
    <input
      type="checkbox"
      onChange={handleChange}
      className={checkboxVariants({ className })}
      {...props}
    />
  );
}
