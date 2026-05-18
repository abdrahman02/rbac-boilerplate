export interface AuthenticatedUser {
  id: number
  email: string
  name: string
  full_name?: string
  roles: Array<{ id: number; name: string }>
  permissions: string[]
}
