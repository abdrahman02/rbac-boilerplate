export interface AuditLog {
  id: number;
  userId: number | null;
  action: string;
  resourceType: string;
  resourceId: number | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}
