import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiClient } from "@/shared/lib/api-client";
import { useAuthStore } from "@/shared/stores/authStore";
import { type AuthenticatedUser, authenticatedUserSchema } from "@/shared/types";

export function useAuth() {
  const { setUser } = useAuthStore();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<AuthenticatedUser | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/me");
      return authenticatedUserSchema.parse(response.data.data);
    },
  });

  // Sync result to Zustand so permission hooks (usePermission, usePermissions) can read from store
  useEffect(() => {
    if (isLoading) return;
    setUser(isError ? null : (user ?? null));
  }, [user, isLoading, isError, setUser]);

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !isLoading && !isError && !!user,
  };
}
