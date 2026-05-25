export interface UserWithRoles {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  roles: string[];
  created_at: string;
}
