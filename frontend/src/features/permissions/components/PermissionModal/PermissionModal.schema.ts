import { z } from "zod";

export const permissionModalSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-z_]+:[a-z_]+$/, "Format must be resource:action (e.g. users:read)"),
  description: z.string().optional(),
});

export type PermissionModalInput = z.infer<typeof permissionModalSchema>;
