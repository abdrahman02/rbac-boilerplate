import { z } from "zod";

const permissionNameSchema = z
  .string()
  .regex(/^[a-z_]+:[a-z_]+$/, "Permission name must follow resource:action format (e.g., users:read)");

export const createPermissionSchema = z.object({
  name: permissionNameSchema,
  description: z.string().max(255).trim().optional(),
});

export const updatePermissionSchema = z
  .object({
    name: permissionNameSchema.optional(),
    description: z.string().max(255).trim().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;
