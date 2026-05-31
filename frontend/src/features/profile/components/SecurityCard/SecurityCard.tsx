"use client";

import { memo } from "react";
import { SECURITY_ITEMS, type SecurityItem } from "./SecurityCard.constants";

interface SecurityCardProps {
  onChangePassword: () => void;
}

export const SecurityCard = memo(function SecurityCard({ onChangePassword }: SecurityCardProps) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card shadow-sm">
      <h3 className="text-sm font-semibold tracking-tight">Security</h3>
      <div className="grid grid-cols-2 gap-2.5">
        {SECURITY_ITEMS.map((item) => (
          <SecurityRow
            key={item.label}
            item={item}
            onAction={item.label === "Password" ? onChangePassword : undefined}
          />
        ))}
      </div>
    </div>
  );
});

const SecurityRow = memo(function SecurityRow({
  item,
  onAction,
}: {
  item: SecurityItem;
  onAction?: () => void;
}) {
  const Icon = item.icon;
  return (
    <div className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-border bg-background">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-muted-foreground shrink-0" />
        <span className="text-[11.5px] font-medium text-muted-foreground truncate">{item.label}</span>
      </div>
      <p className="text-[13px] font-semibold">{item.value}</p>
      <button
        type="button"
        onClick={onAction}
        disabled={!onAction}
        className={
          onAction
            ? "mt-1 text-left text-[12px] font-medium text-primary hover:underline cursor-pointer"
            : "mt-1 text-left text-[12px] font-medium text-muted-foreground cursor-default"
        }
      >
        {item.cta} →
      </button>
    </div>
  );
});
