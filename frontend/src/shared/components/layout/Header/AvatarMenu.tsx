"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { Avatar, Button, Dropdown } from "@/shared/components/ui";
import { useAuth } from "@/shared/hooks";
import { useLogout } from "./useLogout";

export function AvatarMenu() {
  const { user } = useAuth();
  const logout = useLogout();

  const name = user?.name ?? "User";
  const email = user?.email ?? "";

  const trigger = (
    <Button type="button" variant="ghost" size="iconOnly" aria-label="Account menu" className="rounded-full p-0.5">
      <Avatar name={name} size={32} />
    </Button>
  );

  return (
    <Dropdown trigger={trigger}>
      <div className="w-60 bg-popover text-popover-foreground border border-border rounded-xl shadow-md animate-scale-in overflow-hidden">
        <div className="flex items-center gap-2.5 px-3 py-3">
          <Avatar name={name} size={36} />
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold leading-[1.2] truncate">{name}</div>
            <div className="text-xs text-muted-foreground truncate">{email}</div>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="p-1">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-2.5 text-[13.5px] h-auto py-2 px-2.5 rounded-lg"
          >
            <Link href="/profile">
              <User size={16} className="shrink-0" />
              Profile
            </Link>
          </Button>
        </div>

        <div className="h-px bg-border" />

        <div className="p-1">
          <Button
            type="button"
            variant="ghost"
            onClick={logout}
            className="w-full justify-start gap-2.5 text-[13.5px] h-auto py-2 px-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={16} className="shrink-0" />
            Log out
          </Button>
        </div>
      </div>
    </Dropdown>
  );
}
