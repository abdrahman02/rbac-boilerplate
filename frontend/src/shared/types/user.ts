export interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserWithRoles {
  id: number
  name: string
  email: string
  is_active: boolean
  roles: string[]
  created_at: string
}
