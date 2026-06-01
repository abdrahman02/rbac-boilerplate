import { Badge } from "@/shared/components/ui";

interface StatusBadgeProps {
  isActive: boolean;
}

export function StatusBadge({ isActive }: StatusBadgeProps) {
  return isActive ? (
    <Badge variant="success" dot>
      Active
    </Badge>
  ) : (
    <Badge variant="danger" dot>
      Inactive
    </Badge>
  );
}
