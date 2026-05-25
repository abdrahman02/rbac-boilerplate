import { ChevronRight, Key, ScrollText, Shield, Users } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { Button } from "@/shared/components/ui/Button";

interface QuickAction {
  icon: typeof Users;
  label: string;
  href: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: Users, label: "Invite a user", href: "/users" },
  { icon: Shield, label: "Create a role", href: "/roles" },
  { icon: Key, label: "Add a permission", href: "/permissions" },
  { icon: ScrollText, label: "Review audit log", href: "/audit-logs" },
];

export const QuickActions = memo(function QuickActions() {
  return (
    <div className="flex flex-col gap-1.5">
      {QUICK_ACTIONS.map(({ icon: Icon, label, href }) => (
        <Button
          key={href}
          asChild
          variant="ghost"
          className="w-full justify-start gap-2.5 px-3 py-2.5 h-auto bg-muted text-foreground hover:bg-accent hover:text-accent-foreground text-[13px] font-medium group"
        >
          <Link href={href}>
            <span className="text-primary flex">
              <Icon size={16} />
            </span>
            <span className="flex-1">{label}</span>
            <ChevronRight
              size={15}
              className="text-muted-foreground group-hover:text-accent-foreground transition-colors"
            />
          </Link>
        </Button>
      ))}
    </div>
  );
});
