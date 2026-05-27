import { useAuthStore } from "@/shared/stores/authStore";

export function usePermission(permission: string): boolean {
  const { user } = useAuthStore();
  return user?.permissions?.includes(permission) ?? false;
}
