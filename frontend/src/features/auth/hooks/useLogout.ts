import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { apiClient } from '@/shared/lib/api-client'

export function useLogout() {
  const router = useRouter()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSettled: () => {
      clearAuth()
      queryClient.clear()
      router.replace('/login')
    },
  })

  return useCallback(() => mutate(), [mutate])
}
