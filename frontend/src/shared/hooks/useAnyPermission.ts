import { useAuthStore } from "@/shared/stores/authStore";

export function useAnyPermission(permissions: string[]): boolean {
  const { user } = useAuthStore();
  if (permissions.length === 0) return true;
  return permissions.some((p) => user?.permissions?.includes(p) ?? false);
}
