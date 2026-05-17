export interface User {
  id: number
  email: string
  password_hash: string
  full_name: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Role {
  id: number
  name: string
  description: string | null
  created_at: Date
}

export interface Permission {
  id: number
  name: string
  description: string | null
  created_at: Date
}

export interface UserRole {
  user_id: number
  role_id: number
  assigned_at: Date
}

export interface RolePermission {
  role_id: number
  permission_id: number
}

export interface RefreshToken {
  id: number
  user_id: number
  token_hash: string
  expires_at: Date
  created_at: Date
  revoked_at: Date | null
}

export interface AuditLog {
  id: number
  user_id: number | null
  action: string
  resource_type: string
  resource_id: number | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: Date
}

export interface AuthenticatedUser {
  id: number
  name: string
  email: string
  roles: string[]
  permissions: string[]
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

export {}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}
