"use client";

import { type ChangeEvent, type ComponentPropsWithoutRef, useCallback } from "react";
import { checkboxVariants } from "./Checkbox.variants";

type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({ onCheckedChange, onChange, className, ...props }: CheckboxProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    },
    [onChange, onCheckedChange],
  );

  return <input type="checkbox" onChange={handleChange} className={checkboxVariants({ className })} {...props} />;
}
