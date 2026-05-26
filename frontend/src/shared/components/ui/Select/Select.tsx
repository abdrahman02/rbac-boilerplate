"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useRef, useState } from "react";
import { selectOptionAll, selectOptionItem, selectRoot, selectTrigger } from "./Select.variants";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  searchable = false,
  searchPlaceholder = "Search…",
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered =
    searchable && query ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : options;

  const selectedLabel = value ? (options.find((o) => o.value === value)?.label ?? value) : (placeholder ?? "");

  const handleOpen = () => {
    setOpen(true);
    if (searchable) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery("");
  };

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <div className={selectRoot({ className })}>
      <button type="button" onClick={handleOpen} className={selectTrigger({ hasValue: !!value })}>
        <span className="flex-1 truncate">{selectedLabel}</span>
        <ChevronDown
          size={13}
          className={`absolute right-2.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay for click-outside dismiss */}
          <div
            className="fixed inset-0 z-40"
            onClick={close}
            onKeyDown={(e) => e.key === "Escape" && close()}
            aria-hidden="true"
          />
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden min-w-[160px]">
            {searchable && (
              <div className="p-2 border-b border-border">
                <div className="flex items-center gap-1.5 h-7 px-2 bg-muted rounded-md">
                  <Search size={12} className="text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="flex-1 text-[12.5px] bg-transparent outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            )}

            <div className="max-h-44 overflow-y-auto py-1">
              {placeholder !== undefined && (
                <button type="button" onClick={() => select("")} className={selectOptionAll({ selected: !value })}>
                  {!value ? <Check size={12} className="shrink-0" /> : <span className="w-3 shrink-0" />}
                  <span>{placeholder}</span>
                </button>
              )}

              {filtered.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => select(o.value)}
                  className={selectOptionItem({ selected: value === o.value })}
                >
                  {value === o.value ? <Check size={12} className="shrink-0" /> : <span className="w-3 shrink-0" />}
                  <span>{o.label}</span>
                </button>
              ))}

              {searchable && filtered.length === 0 && (
                <p className="px-3 py-2 text-[12.5px] text-muted-foreground text-center">No results found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
