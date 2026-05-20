import { apiClient } from '@/shared/lib/api-client'
import type { AuthenticatedUser } from '@/features/auth/types'
import type { LoginInput } from './login.schema'

/**
 * Sends login credentials to the server and returns the authenticated user.
 */
export async function loginApi(data: LoginInput): Promise<AuthenticatedUser> {
  const response = await apiClient.post('/auth/login', data)
  return response.data.data as AuthenticatedUser
}
