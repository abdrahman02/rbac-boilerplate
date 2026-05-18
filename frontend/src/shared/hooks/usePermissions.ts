import { useAuthStore } from '@/features/auth/stores/authStore'

export function usePermissions(...permissions: string[]): boolean {
  const { user } = useAuthStore()
  return permissions.every((perm) => user?.permissions?.includes(perm) ?? false)
}
