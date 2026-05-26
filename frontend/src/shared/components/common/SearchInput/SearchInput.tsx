import type { ComponentProps } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui";

type SearchInputProps = Omit<ComponentProps<typeof Input>, "type" | "iconLeft" | "iconRight"> & {
  onClear?: () => void;
};

export function SearchInput({ onClear, value, ...props }: SearchInputProps) {
  const showClear = onClear && value;

  return (
    <Input
      iconLeft={<Search size={15} />}
      iconRight={
        showClear ? (
          <button
            type="button"
            onClick={onClear}
            className="flex text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : undefined
      }
      value={value}
      {...props}
    />
  );
}
