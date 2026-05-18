export interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Role {
  id: number
  name: string
  description: string | null
  created_at: string
}

export interface Permission {
  id: number
  name: string
  description: string | null
  created_at: string
}

export interface AuditLog {
  id: number
  user_id: number | null
  action: string
  resource_type: string
  resource_id: number | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
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
