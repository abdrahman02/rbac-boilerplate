export interface AuthenticatedUser {
  id: number
  email: string
  name: string
  roles: string[]
  permissions: string[]
}
