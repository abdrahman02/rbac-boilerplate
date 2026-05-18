import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import { getErrorMessage } from '@/shared/lib/api-error'

export function useApi<T>(url: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET') {
  const { data, error, isPending, mutateAsync } = useMutation<T, Error, unknown>({
    mutationFn: async (payload?: unknown) => {
      switch (method) {
        case 'POST':
          return (await apiClient.post(url, payload)).data.data as T
        case 'PATCH':
          return (await apiClient.patch(url, payload)).data.data as T
        case 'DELETE':
          return (await apiClient.delete(url)).data.data as T
        default:
          return (await apiClient.get(url)).data.data as T
      }
    },
  })

  const execute = useCallback((payload?: unknown) => mutateAsync(payload), [mutateAsync])

  return {
    data: data ?? null,
    error: error ? getErrorMessage(error) : null,
    isLoading: isPending,
    execute,
  }
}
