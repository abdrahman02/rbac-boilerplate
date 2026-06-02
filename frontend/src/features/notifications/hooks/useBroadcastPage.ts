"use client";

import { useMemo } from "react";
import { useRoles } from "@/features/roles/hooks/useRoles";

export function useBroadcastPage() {
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles({ limit: -1 });
  const roles = useMemo(() => rolesData?.data ?? [], [rolesData]);

  return { roles, isLoadingRoles };
}
