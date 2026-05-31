"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/shared/hooks";

export function useProfile() {
  const { user, isLoading } = useAuth();

  const roles = useMemo(() => (user?.roles ?? []).slice().sort((a, b) => a.localeCompare(b)), [user?.roles]);

  const permissions = useMemo(
    () => (user?.permissions ?? []).slice().sort((a, b) => a.localeCompare(b)),
    [user?.permissions],
  );

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return {
    user,
    isLoading,
    roles,
    permissions,
    isEditProfileOpen,
    openEditProfile: () => setIsEditProfileOpen(true),
    closeEditProfile: () => setIsEditProfileOpen(false),
    isChangePasswordOpen,
    openChangePassword: () => setIsChangePasswordOpen(true),
    closeChangePassword: () => setIsChangePasswordOpen(false),
  };
}
