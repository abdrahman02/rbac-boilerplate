import { z } from "zod";
import { emailField } from "./shared.js";

export const createUserSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: emailField,
  role_ids: z.array(z.number().int().positive()).optional(),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(100).trim().optional(),
    email: emailField.optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const syncRolesSchema = z.object({
  role_ids: z.array(z.number().int().positive()),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type SyncRolesInput = z.infer<typeof syncRolesSchema>;
