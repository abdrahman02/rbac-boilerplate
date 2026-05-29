import { z } from 'zod'

const roleNameSchema = z
  .string()
  .min(2)
  .max(50)
  .trim()
  .regex(/^[a-z_]+$/, 'Role name must be lowercase letters and underscores only')

export const createRoleSchema = z.object({
  name: roleNameSchema,
  description: z.string().max(255).trim().optional(),
})

export const updateRoleSchema = z
  .object({
    name: roleNameSchema.optional(),
    description: z.string().max(255).trim().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export const assignPermissionSchema = z.object({
  permission_id: z.number().int().positive(),
})

export const syncPermissionsSchema = z.object({
  permission_ids: z.array(z.number().int().positive()),
})

export type CreateRoleInput = z.infer<typeof createRoleSchema>
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>
export type AssignPermissionInput = z.infer<typeof assignPermissionSchema>
export type SyncPermissionsInput = z.infer<typeof syncPermissionsSchema>
