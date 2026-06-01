import { Badge } from "@/shared/components/ui";

interface StatusBadgeProps {
  isActive: boolean;
  emailVerified: boolean;
}

export function StatusBadge({ isActive, emailVerified }: StatusBadgeProps) {
  if (!emailVerified) {
    return (
      <Badge variant="warning" dot>
        Pending
      </Badge>
    );
  }

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
