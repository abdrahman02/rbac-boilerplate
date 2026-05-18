import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { apiClient } from '@/shared/lib/api-client'
import type { AuthenticatedUser } from '@/features/auth/types'

export function useAuth() {
  const { setUser } = useAuthStore()

  const { data: user, isLoading, isError } = useQuery<AuthenticatedUser | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/me')
      return response.data.data as AuthenticatedUser
    },
  })

  // Sync result to Zustand so permission hooks (usePermission, usePermissions) can read from store
  useEffect(() => {
    if (isLoading) return
    setUser(isError ? null : (user ?? null))
  }, [user, isLoading, isError, setUser])

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !isLoading && !isError && !!user,
  }
}
