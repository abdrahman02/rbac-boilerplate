export interface AuthenticatedUser {
  id: number
  name: string
  email: string
  roles: string[]
  permissions: string[]
}

export interface UserWithRoles {
  id: number
  name: string
  email: string
  is_active: boolean
  roles: string[]
  created_at: Date
}

export interface RoleWithPermissions {
  id: number
  name: string
  description: string | null
  permissions: string[]
  created_at: Date
}

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  message: string | null
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}
