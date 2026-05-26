import { Search, X } from "lucide-react";
import type { ComponentProps } from "react";
import { Button, Input } from "@/shared/components/ui";

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
          <Button
            variant="ghost"
            size="iconOnly"
            onClick={onClear}
            aria-label="Clear search"
            className="w-5 h-5 text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            <X size={14} />
          </Button>
        ) : undefined
      }
      value={value}
      {...props}
    />
  );
}
