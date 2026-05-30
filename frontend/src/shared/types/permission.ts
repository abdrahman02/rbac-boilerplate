export interface Permission {
  id: number;
  name: string;
  description: string | null;
  roles: string[];
  createdAt: string;
}
