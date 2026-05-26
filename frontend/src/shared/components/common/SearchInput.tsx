import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";

type SearchInputProps = Omit<ComponentProps<typeof Input>, "type" | "iconLeft">;

export function SearchInput(props: SearchInputProps) {
  return <Input iconLeft={<Search size={15} />} {...props} />;
}
