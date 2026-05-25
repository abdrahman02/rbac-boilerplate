import type { ReactNode } from "react";

interface FormFieldProps {
  label: ReactNode;
  labelRight?: ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, labelRight, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center">
          {label}
          {required && (
            <span className="text-destructive ml-0.5" aria-hidden>
              *
            </span>
          )}
        </label>
        {labelRight}
      </div>
      {children}
      {(error ?? hint) && (
        <span className={`text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}>{error ?? hint}</span>
      )}
    </div>
  );
}
