export interface AuthenticatedUser {
  id: number
  email: string
  name: string
  full_name?: string
  roles: string[]
  permissions: string[]
}
