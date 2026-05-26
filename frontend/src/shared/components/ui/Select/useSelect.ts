import { useCallback, useMemo, useRef, useState } from "react";
import type { SelectOption } from "./Select";

interface Params {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
}

export const useSelect = ({ value, onChange, options, placeholder, searchable }: Params) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => (searchable && query ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : options),
    [searchable, query, options],
  );

  const selectedLabel = useMemo(
    () => (value ? (options.find((o) => o.value === value)?.label ?? value) : (placeholder ?? "")),
    [value, options, placeholder],
  );

  const handleOpen = useCallback(() => {
    setOpen(true);
    if (searchable) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [searchable]);

  const select = useCallback(
    (v: string) => {
      onChange(v);
      setOpen(false);
      setQuery("");
    },
    [onChange],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  return {
    open,
    query,
    setQuery,
    inputRef,
    filtered,
    selectedLabel,
    handleOpen,
    select,
    close,
  };
};
