"use client";

import type { ChangeEvent, ComponentPropsWithoutRef } from "react";

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
      className={["accent-primary w-4 h-4 cursor-pointer shrink-0", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
