export interface Role {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface RoleWithPermissions {
  id: number;
  name: string;
  description: string | null;
  permissions: string[];
  users: { id: number; name: string }[];
  created_at: string;
}
