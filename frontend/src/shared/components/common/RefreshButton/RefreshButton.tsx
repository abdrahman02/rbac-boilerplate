import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui";

interface RefreshButtonProps {
  isLoading?: boolean;
  onClick: () => void;
  label?: string;
}

export function RefreshButton({ isLoading, onClick, label = "Refresh" }: RefreshButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={isLoading} className="gap-1.5" title={label}>
      {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
      {label}
    </Button>
  );
}
